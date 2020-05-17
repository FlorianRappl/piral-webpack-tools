import { resolve } from 'path';
import { Plugin, Compiler, BannerPlugin, DefinePlugin } from 'webpack';
import { wrapPilet, setEnvironment, getDefineVariables, getVariables } from './helpers';

const pluginName = 'PiletWebpackPlugin';

export interface PiletWebpackPluginOptions {
  variables?: Record<string, string>;
}

export class PiletWebpackPlugin implements Plugin {
  constructor(private piletPackage: any, private options: PiletWebpackPluginOptions = {}) {}

  apply(compiler: Compiler) {
    const piletPkg = this.piletPackage;
    const shellPkg = require(`${piletPkg.piral.name}/package.json`);
    const shortName = piletPkg.name.replace(/\W/gi, '');
    const jsonpFunction = `pr_${shortName}`;
    const environment = process.env.NODE_ENV || 'development';
    const piralExternals = shellPkg.pilets?.externals ?? [];
    const piletExternals = piletPkg.externals ?? [];
    const peerDependencies = Object.keys(piletPkg.peerDependencies ?? {});
    const externals = [...piralExternals, ...piletExternals, ...peerDependencies];
    const variables = {
      ...getVariables(piletPkg, environment),
      ...this.options.variables,
    };
    const plugins = [
      new BannerPlugin({
        banner: `//@pilet v:1(${jsonpFunction})`,
        entryOnly: true,
        raw: true,
      }),
      new DefinePlugin(getDefineVariables(variables)),
    ];

    setEnvironment(variables);

    plugins.forEach(plugin => plugin.apply(compiler));

    compiler.hooks.done.tap(pluginName, statsData => {
      if (!statsData.hasErrors()) {
        const { path, filename } = compiler.options.output;

        if (typeof filename === 'string') {
          const file = resolve(path, filename);
          wrapPilet(file, jsonpFunction);
        } else {
          const [main] = statsData.compilation.chunks.filter(m => m.entryModule).map(m => m.files[0]);
          const file = resolve(compiler.outputPath, main);
          wrapPilet(file, jsonpFunction);
        }
      }
    });

    compiler.hooks.afterEnvironment.tap(pluginName, () => {
      const current = compiler.options.externals;
      compiler.options.output.jsonpFunction = `${jsonpFunction}_chunks`;
      compiler.options.output.libraryTarget = 'umd';
      compiler.options.output.library = piletPkg.name;
      compiler.options.externals = Array.isArray(current)
        ? [...current, ...externals]
        : current
        ? [current, ...externals]
        : externals;
    });
  }
}
