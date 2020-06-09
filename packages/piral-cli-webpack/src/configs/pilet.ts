import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import { PiletWebpackPlugin } from 'pilet-webpack-plugin';
import { join } from 'path';
import { getOrMakeAppDir } from './app';
import { getEnvironment, getRules, getPlugins } from './common';

function getFileName(develop: boolean) {
  const name = develop ? 'pilet' : 'index';
  return `${name}.js`;
}

export async function getPiletConfig(
  baseDir = process.cwd(),
  progress = false,
  port = 1234,
  distDir = 'dist',
  srcDir = 'src',
  entryFile = 'index',
): Promise<webpack.Configuration> {
  const { develop, production } = getEnvironment();
  const piletPkg = require(join(baseDir, 'package.json'));
  const shellPkg = require(join(piletPkg.piral.name, 'package.json'));
  const dist = join(baseDir, distDir);
  const src = join(baseDir, srcDir);
  const app = await getOrMakeAppDir(shellPkg, progress);
  const fileName = getFileName(develop);

  return {
    devtool: develop ? 'cheap-module-source-map' : 'source-map',

    mode: production ? 'production' : 'development',

    entry: {
      main: [join(__dirname, '..', 'set-path'), join(src, entryFile)],
    },

    devServer: {
      contentBase: [app, dist],
      compress: true,
      historyApiFallback: true,
      port,
      headers: {
        // force no cache
        'cache-control': 'no-cache, no-store, must-revalidate',
        pragma: 'no-cache',
        expires: '0',
        get etag() {
          return Math.random()
            .toString(36)
            .substr(2);
        },
      },
      before(app: any) {
        app.get('/([$])pilet-api', (_: any, res: any) => {
          res.json({
            name: piletPkg.name,
            version: piletPkg.version,
            link: `/${fileName}`,
            hash: '0',
            noCache: true,
            custom: piletPkg.custom,
          });
        });
      },
    },

    output: {
      path: dist,
      filename: fileName,
    },

    resolve: {
      alias: piletPkg.alias || {},
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
            output: {
              comments: /^@pilet/,
            },
          },
        }),
      ],
    },

    plugins: getPlugins(
      [
        new PiletWebpackPlugin(piletPkg, {
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
