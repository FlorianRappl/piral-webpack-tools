import { join, resolve } from 'path';
import { declarationPiral } from 'piral-cli/lib/apps/declaration-piral';
import { findPackageVersion, copyScaffoldingFiles } from 'piral-cli/lib/common/package';
import { createFileFromTemplateIfNotExists } from 'piral-cli/lib/common/template';
import { coreExternals, cliVersion } from 'piral-cli/lib/common/info';
import { createPackage } from 'piral-cli/lib/common/npm';
import { ForceOverwrite } from 'piral-cli/lib/types/internal';
import {
  createDirectory,
  removeDirectory,
  remove,
  createFileIfNotExists,
  updateExistingJson,
} from 'piral-cli/lib/common/io';

export function removeDir(dir: string) {
  return removeDirectory(dir);
}

//TODO this code should come 100% from Piral-CLI!
export async function createEmulatorPackage(sourceDir: string, targetDir: string) {
  const piralPkg = require(join(sourceDir, 'package.json'));
  const externals = piralPkg.pilets?.externals ?? [];
  const files = piralPkg.pilets?.files ?? [];
  const allExternals = [...externals, ...coreExternals];
  const externalPackages = await Promise.all(
    allExternals.map(async (name) => ({
      name,
      version: await findPackageVersion(sourceDir, name),
    })),
  );
  const externalDependencies = externalPackages.reduce((deps, dep) => {
    deps[dep.name] = dep.version;
    return deps;
  }, {} as Record<string, string>);
  const rootDir = resolve(targetDir, '..');
  const filesDir = resolve(rootDir, 'files');
  const filesMap = files
    .map((file) => (typeof file === 'string' ? { from: file, to: file } : file))
    .map((file) => ({
      ...file,
      to: file.to.replace(/\\/g, '/'),
      from: join('files', file.from).replace(/\\/g, '/'),
    }));
  await createFileIfNotExists(rootDir, 'package.json', '{}');
  await updateExistingJson(rootDir, 'package.json', {
    name: piralPkg.name,
    version: piralPkg.version,
    pilets: {
      ...piralPkg.pilets,
      files: filesMap,
    },
    piralCLI: {
      version: cliVersion,
      generated: true,
    },
    main: `./app/index.js`,
    typings: `./app/index.d.ts`,
    app: `./app/index.html`,
    peerDependencies: {},
    devDependencies: {
      ...piralPkg.devDependencies,
      ...piralPkg.dependencies,
      ...externalDependencies,
    },
  });
  await createDirectory(filesDir);
  // for scaffolding we need to keep the files also available in the new package
  await copyScaffoldingFiles(sourceDir, filesDir, files);
  // we just want to make sure that "files" mentioned in the original package.json are respected in the package
  await copyScaffoldingFiles(sourceDir, rootDir, piralPkg.files ?? []);
  // actually including this one hints that the app shell should have been included - which is forbidden
  await createFileFromTemplateIfNotExists('other', 'piral', targetDir, 'index.js', ForceOverwrite.yes, {
    name: piralPkg.name,
    outFile: 'index.dev.js',
  });
  await declarationPiral(sourceDir, {
    entry: piralPkg.app ?? `./src/index.html`,
    target: targetDir,
  });
  await createPackage(rootDir);
  await Promise.all([removeDirectory(targetDir), removeDirectory(filesDir), remove(resolve(rootDir, 'package.json'))]);
}
