import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { load } from 'cheerio';
import { join, resolve, dirname } from 'path';
import { readFileSync } from 'fs';
import { getEnvironment, getRules } from './common';

function setEnvironmentVariables(piralPkg: any) {
  const excludedDependencies = ['piral', 'piral-core', 'piral-base'];
  const dependencies = piralPkg.pilets?.externals ?? [];
  process.env.BUILD_TIME = new Date().toDateString();
  process.env.BUILD_TIME_FULL = new Date().toISOString();
  process.env.BUILD_PCKG_VERSION = piralPkg.version;
  process.env.BUILD_PCKG_NAME = piralPkg.name;
  process.env.PIRAL_CLI_VERSION = require('piral-cli/package.json').version;
  process.env.SHARED_DEPENDENCIES = dependencies.filter(m => !excludedDependencies.includes(m)).join(',');
}

function isLocal(path: string) {
  if (path) {
    if (path.startsWith(':')) {
      return false;
    } else if (path.startsWith('http:')) {
      return false;
    } else if (path.startsWith('https:')) {
      return false;
    } else if (path.startsWith('data:')) {
      return false;
    }

    return true;
  }

  return false;
}

function extractParts(content: CheerioStatic) {
  const sheets = content('link[href]').filter((_, e) => isLocal(e.attribs.href)).remove().toArray();
  const scripts = content('script[src]').filter((_, e) => isLocal(e.attribs.src)).remove().toArray();
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
): webpack.Configuration {
  const { develop, test, production, env } = getEnvironment();

  const piralPkg = require(join(baseDir, 'package.json'));
  const dist = join(baseDir, distDir);
  const template = resolve(baseDir, piralPkg.app ?? `./src/index.html`);
  const src = dirname(template);
  const templateContent = load(readFileSync(template, 'utf8'));
  const entries = extractParts(templateContent);

  setEnvironmentVariables(piralPkg);

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
      main: entries.map(entry => join(src, entry)),
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
        'process.env.SHARED_DEPENDENCIES': JSON.stringify(process.env.SHARED_DEPENDENCIES),
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
