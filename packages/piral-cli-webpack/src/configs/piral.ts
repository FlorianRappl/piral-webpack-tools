import * as webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { PiralInstanceWebpackPlugin } from 'piral-instance-webpack-plugin';
import { debugPiletApi, compatVersion } from 'piral-cli/lib/common/info';
import { load } from 'cheerio';
import { join, resolve, dirname } from 'path';
import { readFileSync } from 'fs';
import { getEnvironment, getRules, isLocal, getPlugins } from './common';

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

export async function getPiralConfig(
  baseDir = process.cwd(),
  progress = false,
  port = 1234,
  distDir = 'dist',
  emulator = false,
): Promise<webpack.Configuration> {
  const { develop, test, production } = getEnvironment();

  const piralPkg = require(join(baseDir, 'package.json'));
  const dist = join(baseDir, distDir);
  const template = resolve(baseDir, piralPkg.app ?? `./src/index.html`);
  const src = dirname(template);
  const templateContent = load(readFileSync(template, 'utf8'));
  const entries = extractParts(templateContent);

  function getFileName() {
    const name = develop ? 'dev' : 'prod';
    return `index.${name}.js`;
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

    plugins: getPlugins(
      [
        new HtmlWebpackPlugin({
          templateContent: templateContent.html(),
        }),
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
