import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';
import { resolve } from 'path';
import { getPiralConfig } from '../configs';
import { extendConfig } from '../helpers';

export async function debugPiral(baseDir: string, port: number, config: string, progress: boolean) {
  process.env.NODE_ENV = 'development';
  const otherConfigPath = resolve(process.cwd(), baseDir, config);
  const baseConfig = await getPiralConfig(baseDir, progress, port);
  const wpConfig = extendConfig(baseConfig, otherConfigPath);

  await new Promise((_, reject) => {
    const devServer = new WebpackDevServer(webpack(wpConfig), wpConfig.devServer);
    devServer.listen(port, (err) => {
      if (err) {
        reject(err);
      }
    });
  });
}
