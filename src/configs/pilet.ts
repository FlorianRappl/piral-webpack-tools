import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import { join, resolve } from 'path';
import { getInfos } from './shared';

export function getPiletConfig(
  baseDir = process.cwd(),
  port = 1234,
  distDir = 'dist',
  srcDir = 'src',
  entryFile = 'index',
): webpack.Configuration {
  const { develop, test, production, env } = getInfos();
  const piletPkg = require(join(baseDir, 'package.json'));
  const shellPkg = require(join(piletPkg.piral.name, 'package.json'));

  const dist = join(baseDir, distDir);
  const src = join(baseDir, srcDir);
  const app = join(baseDir, 'node_modules', piletPkg.piral.name, 'app');

  const shared = shellPkg.pilets?.externals ?? [];
  const externals = [...shared, ...Object.keys(piletPkg.peerDependencies)];

  function getFileName() {
    const name = develop ? 'dev' : 'prod';
    return `index.${name}.js`;
  }

  function getPlugins(plugins: Array<any>) {
    if (production) {
      return plugins.concat([new webpack.optimize.OccurrenceOrderPlugin(true)]);
    }

    return plugins;
  }

  return {
    devtool: develop || test ? 'source-map' : false,

    mode: production ? 'production' : 'development',

    entry: {
      main: [join(src, entryFile)],
    },

    devServer: {
      contentBase: [app, dist],
      compress: true,
      historyApiFallback: true,
      port,
      before(app: any) {
        app.get('/([$])pilet-api', (_: any, res: any) => {
          res.json({
            name: piletPkg.name,
            version: piletPkg.version,
            link: `http://localhost:${port}/${getFileName()}`,
            hash: '0',
            noCache: true,
            custom: piletPkg.custom,
          });
        });
      },
    },

    externals,

    output: {
      path: dist,
      filename: getFileName(),
      library: piletPkg.name,
      libraryTarget: 'umd',
    },

    resolve: {
      alias: piletPkg.alias || {},
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },

    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|mp4|mp3|svg|ogg|webp|wav)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                esModule: false,
              },
            },
          ],
        },
        {
          test: /\.tsx?$/,
          loaders: [
            {
              loader: 'awesome-typescript-loader',
              options: {
                tsconfig: resolve(baseDir, 'tsconfig.json'),
              },
            },
          ],
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: resolve(baseDir, 'node_modules'),
        },
      ],
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

    plugins: getPlugins([
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
    ]),
  };
}
