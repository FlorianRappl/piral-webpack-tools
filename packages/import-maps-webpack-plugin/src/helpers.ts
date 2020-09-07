import { existsSync } from 'fs';
import { resolve, relative } from 'path';

function getSourcePath(root: string, file: string) {
  return `../${relative(root, file)}`;
}

function resolvePath(root: string, dir: string, file: string) {
  if (file.startsWith('/')) {
    return getSourcePath(root, `.${file}`);
  } else {
    return getSourcePath(root, resolve(dir, file));
  }
}

function getPackageJson(dir: string) {
  if (dir) {
    const path = resolve(dir, 'package.json');
    return require(path);
  }

  return {};
}

export function getPackageDir(dir: string) {
  const path = resolve(dir, 'package.json');

  if (existsSync(path)) {
    return dir;
  }

  const upper = resolve(dir, '..');

  if (upper !== dir) {
    return getPackageDir(upper);
  }

  return undefined;
}

export function getHashFor(root: string, dir: string, file: string) {
  if (!file.startsWith('http:') && !file.startsWith('https:')) {
    const path = resolvePath(root, dir, file);
    return `require.resolveWeak(${JSON.stringify(path)})`;
  } else {
    return JSON.stringify(file);
  }
}

export function getImportFor(root: string, dir: string, file: string) {
  if (!file.startsWith('http:') && !file.startsWith('https:')) {
    const path = resolvePath(root, dir, file);
    return `import(${JSON.stringify(path)})`;
  } else {
    return `new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", ${JSON.stringify(file)});
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const result = {
              exports: {},
            };
            const f = new Function('module', 'exports', 'require', xhr.responseText);
            f(result, result.exports, require);
            resolve(result.exports);
          } else {
            reject(xhr.statusText);
          }
        }
      };
      xhr.send();
    })`;
  }
}

export function resolveImportMap(dir: string) {
  const pckg = getPackageJson(dir);
  const map = pckg.importmap;

  if (typeof map === 'string') {
    const target = resolve(dir, map);

    if (existsSync(target)) {
      return require(target);
    } else {
      console.warn(`Could not find the referenced import maps "${map}" from ${dir}. Skipping.`);
    }
  } else if (typeof map === 'object') {
    return map;
  }

  return undefined;
}
