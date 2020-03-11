import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';
import { CliPlugin } from 'piral-cli';
import { resolve } from 'path';
import { getPiletConfig } from './configs';
import { extendConfig } from './helpers';

const plugin: CliPlugin = cli => {
  cli.withCommand({
    name: 'buildpack-pilet',
    alias: ['build-wp-pilet'],
    description: 'Builds the pilet via Webpack.',
    arguments: [],
    flags(argv) {
      return argv
        .string('config')
        .describe('config', 'The location of the optional webpack config.')
        .default('config', 'webpack.config.js')
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      const baseDir = args.base as string;
      const otherConfigPath = resolve(process.cwd(), baseDir, args.config as string);
      const wpConfig = extendConfig(getPiletConfig(baseDir), otherConfigPath);

      return new Promise((resolve, reject) => {
        webpack(wpConfig, (err, stats) => {
          if (err || stats.hasErrors()) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    },
  });

  cli.withCommand({
    name: 'debugpack-pilet',
    alias: ['debug-wp-pilet'],
    description: 'Debugs the pilet via the Webpack DevServer.',
    arguments: [],
    flags(argv) {
      return argv
        .string('config')
        .describe('config', 'The location of the optional webpack config.')
        .default('config', 'webpack.config.js')
        .number('port')
        .describe('port', 'The port for running the dev server.')
        .default('port', 1234)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      const port = args.port as number;
      const baseDir = args.base as string;
      const otherConfigPath = resolve(process.cwd(), baseDir, args.config as string);
      const wpConfig = extendConfig(getPiletConfig(baseDir, port), otherConfigPath);

      return new Promise((_, reject) => {
        const devServer = new WebpackDevServer(webpack(wpConfig));
        devServer.listen(port, err => {
          if (err) {
            reject(err);
          }
        });
      });
    },
  });
};

module.exports = plugin;
