import * as webpack from 'webpack';
import { resolve } from 'path';
import { getPiralConfig } from '../configs';
import { extendConfig } from '../helpers';
import { createEmulatorPackage, removeDir } from '../emulator';

export const normalTypes = ['develop', 'release'];

export async function buildPiral(baseDir: string, argsType: string, config: string, progress: boolean, skipEmulator?: boolean) {
  const types: Array<string> = [];

  if (argsType === 'all') {
    types.push(...normalTypes);
  } else if (normalTypes.includes(argsType)) {
    types.push(argsType);
  }

  for (const type of types) {
    const release = type === 'release';
    const emulator = !release;
    process.env.NODE_ENV = release ? 'production' : 'development';
    const otherConfigPath = resolve(process.cwd(), baseDir, config);
    const targetBase = emulator ? `dist/develop` : `dist/release`;
    const target = emulator ? `${targetBase}/app` : targetBase;
    await removeDir(targetBase);
    const baseConfig = await getPiralConfig(baseDir, progress, undefined, target, emulator);
    const wpConfig = extendConfig(baseConfig, otherConfigPath);

    await new Promise((resolve, reject) => {
      webpack(wpConfig, (err, stats) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(
            stats.toString({
              chunks: false,
              colors: true,
              usedExports: true,
            }),
          );

          if (stats.hasErrors()) {
            reject(stats.toJson());
          } else {
            resolve();
          }
        }
      });
    });

    if (emulator && !skipEmulator) {
      await createEmulatorPackage(baseDir, target);
    }
  }
}
