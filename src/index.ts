import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';
import { resolve } from 'path';
import { CliPlugin } from 'piral-cli';
import { getPiletConfig, getPiralConfig } from './configs';
import { createEmulatorPackage } from './emulator';
import { extendConfig } from './helpers';

const normalTypes = ['develop', 'release'];

const plugin: CliPlugin = (cli) => {
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
      process.env.NODE_ENV = 'production';
      const baseDir = args.base as string;
      const otherConfigPath = resolve(process.cwd(), baseDir, args.config as string);
      const wpConfig = extendConfig(getPiletConfig(baseDir), otherConfigPath);

      return new Promise((resolve, reject) => {
        webpack(wpConfig, (err, stats) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(
              stats.toString({
                chunks: false,
                colors: true,
                usedExports: true,
              }),
            );

            if (stats.hasErrors()) {
              reject(stats.toJson());
            } else {
              resolve();
            }
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
      process.env.NODE_ENV = 'development';
      const port = args.port as number;
      const baseDir = args.base as string;
      const otherConfigPath = resolve(process.cwd(), baseDir, args.config as string);
      const wpConfig = extendConfig(getPiletConfig(baseDir, port), otherConfigPath);

      return new Promise((_, reject) => {
        const devServer = new WebpackDevServer(webpack(wpConfig), wpConfig.devServer);
        devServer.listen(port, (err) => {
          if (err) {
            reject(err);
          }
        });
      });
    },
  });

  cli.withCommand({
    name: 'buildpack-piral',
    alias: ['build-wp-piral'],
    description: 'Builds the Piral instance via Webpack.',
    arguments: [],
    flags(argv) {
      return argv
        .string('config')
        .describe('config', 'The location of the optional webpack config.')
        .default('config', 'webpack.config.js')
        .choices('type', ['all', ...normalTypes])
        .describe('type', 'Selects the target type of the build. "all" builds all target types.')
        .default('type', 'all')
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    async run(args) {
      const baseDir = args.base as string;
      const argsType = args.type as string;
      const types: Array<string> = [];

      if (args.type === 'all') {
        types.push(...normalTypes);
      } else if (normalTypes.includes(argsType)) {
        types.push(argsType);
      }

      for (const type of types) {
        const release = type === 'release';
        const emulator = !release;
        process.env.NODE_ENV = release ? 'production' : 'development';
        const otherConfigPath = resolve(process.cwd(), baseDir, args.config as string);
        const target = emulator ? `dist/develop/app` : `dist/release`;
        const wpConfig = extendConfig(getPiralConfig(baseDir, undefined, target, emulator), otherConfigPath);

        await new Promise((resolve, reject) => {
          webpack(wpConfig, (err, stats) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              console.log(
                stats.toString({
                  chunks: false,
                  colors: true,
                  usedExports: true,
                }),
              );

              if (stats.hasErrors()) {
                reject(stats.toJson());
              } else {
                resolve();
              }
            }
          });
        });

        if (emulator) {
          await createEmulatorPackage(baseDir, target);
        }
      }
    },
  });

  cli.withCommand({
    name: 'debugpack-piral',
    alias: ['debug-wp-piral'],
    description: 'Debugs the Piral instance via the Webpack DevServer.',
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
      process.env.NODE_ENV = 'development';
      const port = args.port as number;
      const baseDir = args.base as string;
      const otherConfigPath = resolve(process.cwd(), baseDir, args.config as string);
      const wpConfig = extendConfig(getPiralConfig(baseDir, port), otherConfigPath);

      return new Promise((_, reject) => {
        const devServer = new WebpackDevServer(webpack(wpConfig), wpConfig.devServer);
        devServer.listen(port, (err) => {
          if (err) {
            reject(err);
          }
        });
      });
    },
  });
};

module.exports = plugin;
