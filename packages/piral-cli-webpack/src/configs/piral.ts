import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import { Html5EntryWebpackPlugin } from 'html5-entry-webpack-plugin';
import { PiralInstanceWebpackPlugin } from 'piral-instance-webpack-plugin';
import { debugPiletApi, compatVersion } from 'piral-cli/lib/common/info';
import { join, resolve } from 'path';
import { getEnvironment, getRules, getPlugins } from './common';

function getFileName(develop: boolean) {
  const name = develop ? 'dev' : 'prod';
  return `index.${name}.js`;
}

export async function getPiralConfig(
  baseDir = process.cwd(),
  progress = false,
  port = 1234,
  distDir = 'dist',
  emulator = false,
): Promise<webpack.Configuration> {
  const { develop, production } = getEnvironment();
  const piralPkg = require(join(baseDir, 'package.json'));
  const dist = join(baseDir, distDir);
  const template = resolve(baseDir, piralPkg.app ?? `./src/index.html`);

  return {
    devtool: develop ? 'cheap-module-source-map' : 'source-map',

    mode: production ? 'production' : 'development',

    entry: {
      main: [template],
    },

    devServer: {
      contentBase: [dist],
      compress: true,
      historyApiFallback: true,
      port,
    },

    output: {
      publicPath: '/',
      path: dist,
      filename: getFileName(develop),
    },

    resolve: {
      alias: piralPkg.alias || {},
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },

    module: {
      rules: getRules(baseDir),
    },

    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            warnings: false,
            ie8: true,
          },
        }),
      ],
    },

    plugins: getPlugins(
      [
        new Html5EntryWebpackPlugin(),
        new PiralInstanceWebpackPlugin(piralPkg, {
          debug: develop && compatVersion,
          emulator: emulator && debugPiletApi,
          variables: {
            PIRAL_CLI_VERSION: require('piral-cli/package.json').version,
          },
        }),
      ],
      progress,
      production,
    ),
  };
}
