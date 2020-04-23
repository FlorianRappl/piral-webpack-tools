import { CliPlugin } from 'piral-cli';
import { buildPilet } from './commands/build-pilet';
import { buildPiral, normalTypes } from './commands/build-piral';
import { debugPiral } from './commands/debug-piral';
import { debugPilet } from './commands/debug-pilet';

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
        .boolean('progress')
        .describe('progress', 'Shows the progress of the bundling process.')
        .default('progress', false)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      const progress = args.progress as boolean;
      const baseDir = args.base as string;
      const config = args.config as string;
      return buildPilet(baseDir, config, progress);
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
        .boolean('progress')
        .describe('progress', 'Shows the progress of the bundling process.')
        .default('progress', false)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      const progress = args.progress as boolean;
      const port = args.port as number;
      const baseDir = args.base as string;
      const config = args.config as string;
      return debugPilet(baseDir, port, config, progress);
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
        .boolean('progress')
        .describe('progress', 'Shows the progress of the bundling process.')
        .default('progress', false)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      const progress = args.progress as boolean;
      const baseDir = args.base as string;
      const argsType = args.type as string;
      const config = args.config as string;
      return buildPiral(baseDir, argsType, config, progress);
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
        .boolean('progress')
        .describe('progress', 'Shows the progress of the bundling process.')
        .default('progress', false)
        .string('base')
        .default('base', process.cwd())
        .describe('base', 'Sets the base directory. By default the current directory is used.');
    },
    run(args) {
      const progress = args.progress as boolean;
      const port = args.port as number;
      const baseDir = args.base as string;
      const config = args.config as string;
      return debugPiral(baseDir, port, config, progress);
    },
  });
};

module.exports = plugin;
