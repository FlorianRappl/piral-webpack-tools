import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { debugPiletApi, compatVersion } from 'piral-cli/lib/common/info';
import { load } from 'cheerio';
import { join, resolve, dirname } from 'path';
import { readFileSync } from 'fs';
import { getEnvironment, getRules, isLocal, getDefineVariables, setEnvironment } from './common';

function getVariables(piralPkg: any): Record<string, string> {
  const excludedDependencies = ['piral', 'piral-core', 'piral-base', piralPkg.name];
  const dependencies = piralPkg.pilets?.externals ?? [];
  return {
    BUILD_TIME: new Date().toDateString(),
    BUILD_TIME_FULL: new Date().toISOString(),
    BUILD_PCKG_VERSION: piralPkg.version,
    BUILD_PCKG_NAME: piralPkg.name,
    PIRAL_CLI_VERSION: require('piral-cli/package.json').version,
    SHARED_DEPENDENCIES: dependencies.filter((m) => !excludedDependencies.includes(m)).join(','),
  };
}

function extractParts(content: CheerioStatic) {
  const sheets = content('link[href]')
    .filter((_, e) => isLocal(e.attribs.href))
    .remove()
    .toArray();
  const scripts = content('script[src]')
    .filter((_, e) => isLocal(e.attribs.src))
    .remove()
    .toArray();
  const files: Array<string> = [];

  for (const sheet of sheets) {
    files.push(sheet.attribs.href);
  }

  for (const script of scripts) {
    files.push(script.attribs.src);
  }

  return files;
}

export function getPiralConfig(
  baseDir = process.cwd(),
  port = 1234,
  distDir = 'dist',
  emulator = false,
): webpack.Configuration {
  const { develop, test, production, env } = getEnvironment();

  const piralPkg = require(join(baseDir, 'package.json'));
  const dist = join(baseDir, distDir);
  const template = resolve(baseDir, piralPkg.app ?? `./src/index.html`);
  const src = dirname(template);
  const templateContent = load(readFileSync(template, 'utf8'));
  const entries = extractParts(templateContent);
  const variables = getVariables(piralPkg);

  if (develop) {
    variables.DEBUG_PIRAL = compatVersion;
  }

  if (emulator) {
    variables.DEBUG_PILET = debugPiletApi;
  }

  setEnvironment(variables);

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
      main: entries.map((entry) => join(src, entry)),
    },

    devServer: {
      contentBase: [dist],
      compress: true,
      historyApiFallback: true,
      port,
    },

    output: {
      path: dist,
      filename: getFileName(),
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

    plugins: getPlugins([
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
        ...getDefineVariables(variables),
      }),

      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),

      new HtmlWebpackPlugin({
        templateContent: templateContent.html(),
      }),
    ]),
  };
}
