import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as ReplaceInFileWebpackPlugin from 'replace-in-file-webpack-plugin';
import { getEnvironment, getRules, setEnvironment, getDefineVariables } from './common';
import { join } from 'path';

function getVariables(piletPkg: any): Record<string, string> {
  return {
    BUILD_TIME: new Date().toDateString(),
    BUILD_TIME_FULL: new Date().toISOString(),
    BUILD_PCKG_VERSION: piletPkg.version,
    BUILD_PCKG_NAME: piletPkg.name,
    PIRAL_CLI_VERSION: require('piral-cli/package.json').version,
  };
}

export function getPiletConfig(
  baseDir = process.cwd(),
  port = 1234,
  distDir = 'dist',
  srcDir = 'src',
  entryFile = 'index',
): webpack.Configuration {
  const { develop, test, production, env } = getEnvironment();
  const piletPkg = require(join(baseDir, 'package.json'));
  const shellPkg = require(join(piletPkg.piral.name, 'package.json'));

  const dist = join(baseDir, distDir);
  const src = join(baseDir, srcDir);
  const app = join(baseDir, 'node_modules', piletPkg.piral.name, 'app');
  const variables = getVariables(piletPkg);

  setEnvironment(variables);

  const piralExternals = shellPkg.pilets?.externals ?? [];
  const piletExternals = piletPkg.externals ?? [];
  const peerDependencies = Object.keys(piletPkg.peerDependencies ?? {});
  const externals = [...piralExternals, ...piletExternals, ...peerDependencies];
  const shortName = piletPkg.name.replace(/\W/gi, '');
  const jsonpFunction = `pr_${shortName}`;

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
      jsonpFunction,
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

    plugins: getPlugins([
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
        ...getDefineVariables(variables),
      }),

      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),

      new webpack.BannerPlugin({
        banner: `//@pilet v:1(${jsonpFunction})`,
        entryOnly: true,
        raw: true,
      }),

      new ReplaceInFileWebpackPlugin([
        {
          dir: dist,
          files: [getFileName()],
          rules: [
            {
              search: /^\!function\s?\(e,\s?t\)\s?\{/m,
              replace: `!function(e,t){function define(d,k){(typeof document!=='undefined')&&(document.currentScript.app=k.apply(d.map(window.${jsonpFunction})));}define.amd=!0;`,
            },
          ],
        },
      ]),
    ]),
  };
}
