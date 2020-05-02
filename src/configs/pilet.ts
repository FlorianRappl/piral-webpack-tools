import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import { join } from 'path';
import { getOrMakeAppDir } from './app';
import { getEnvironment, getRules, setEnvironment, getPlugins } from './common';
import { PostProcessPlugin } from '../plugins/PostProcessPlugin';

function getVariables(piletPkg: any, env: string): Record<string, string> {
  return {
    NODE_ENV: env,
    BUILD_TIME: new Date().toDateString(),
    BUILD_TIME_FULL: new Date().toISOString(),
    BUILD_PCKG_VERSION: piletPkg.version,
    BUILD_PCKG_NAME: piletPkg.name,
    PIRAL_CLI_VERSION: require('piral-cli/package.json').version,
  };
}

export async function getPiletConfig(
  baseDir = process.cwd(),
  progress = false,
  port = 1234,
  distDir = 'dist',
  srcDir = 'src',
  entryFile = 'index',
): Promise<webpack.Configuration> {
  const { develop, test, production, env } = getEnvironment();
  const piletPkg = require(join(baseDir, 'package.json'));
  const shellPkg = require(join(piletPkg.piral.name, 'package.json'));

  const piralExternals = shellPkg.pilets?.externals ?? [];
  const piletExternals = piletPkg.externals ?? [];
  const peerDependencies = Object.keys(piletPkg.peerDependencies ?? {});
  const externals = [...piralExternals, ...piletExternals, ...peerDependencies];
  const shortName = piletPkg.name.replace(/\W/gi, '');
  const jsonpFunction = `pr_${shortName}`;

  const dist = join(baseDir, distDir);
  const src = join(baseDir, srcDir);
  const app = await getOrMakeAppDir(shellPkg, progress);
  const variables = getVariables(piletPkg, env);

  setEnvironment(variables);

  function getFileName() {
    const name = develop ? 'pilet' : 'index';
    return `${name}.js`;
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
      headers: {
        // force no cache
        'cache-control': 'no-cache, no-store, must-revalidate',
        pragma: 'no-cache',
        expires: '0',
        get etag() {
          return Math.random().toString(36).substr(2);
        },
      },
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

    plugins: getPlugins(
      [
        new webpack.BannerPlugin({
          banner: `//@pilet v:1(${jsonpFunction})`,
          entryOnly: true,
          raw: true,
        }),

        new PostProcessPlugin({
          dir: dist,
          file: getFileName(),
          prName: jsonpFunction,
        }),
      ],
      progress,
      production,
      variables,
    ),
  };
}
