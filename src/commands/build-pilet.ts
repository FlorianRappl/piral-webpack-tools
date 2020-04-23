import * as webpack from 'webpack';
import { resolve } from 'path';
import { getPiletConfig } from '../configs';
import { extendConfig } from '../helpers';

export async function buildPilet(baseDir: string, config: string, progress: boolean) {
  process.env.NODE_ENV = 'production';
  const otherConfigPath = resolve(process.cwd(), baseDir, config);
  const baseConfig = await getPiletConfig(baseDir, progress);
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
}
