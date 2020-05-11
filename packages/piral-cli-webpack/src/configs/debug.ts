import * as webpack from 'webpack';
import { resolve, dirname, basename } from 'path';
import { log } from 'piral-cli/lib/common';
import { getPiralConfig } from './piral';
import { defaultWebpackConfig } from '../constants';
import { extendConfig } from '../helpers';

async function run(root: string, progress: boolean) {
  process.env.NODE_ENV = 'development';
  const otherConfigPath = resolve(process.cwd(), root, defaultWebpackConfig);
  const baseConfig = await getPiralConfig(root, progress, undefined, undefined, true);
  baseConfig.watch = true;
  const wpConfig = extendConfig(baseConfig, otherConfigPath);

  await new Promise((resolve, reject) => {
    let done = false;

    const setDone = () => {
      if (!done) {
        done = true;
        resolve();
      } else {
        log('generalInfo_0000', `The Piral instance changed. Refresh your browser to get the latest changes.`);
      }
    };

    const reportError = (err: any) => {
      console.error(err);

      if (!done) {
        done = true;
        reject(err);
      }
    };

    webpack(wpConfig, (err, stats) => {
      if (err) {
        reportError(err);
      } else {
        console.log(
          stats.toString({
            chunks: false,
            colors: true,
            usedExports: true,
          }),
        );

        if (stats.hasErrors()) {
          reportError(stats.toJson());
        } else {
          setDone();
        }
      }
    });
  });

  return resolve(root, 'dist', 'index.html');
}

process.on('message', async msg => {
  switch (msg.type) {
    case 'start':
      const outPath = await run(process.cwd(), msg.progress);
      process.send({
        type: 'done',
        outDir: dirname(outPath),
        outFile: basename(outPath),
      });
      break;
  }
});
