import { Plugin, Compiler, DefinePlugin } from 'webpack';
import { setEnvironment, getDefineVariables, getVariables } from './helpers';

const pluginName = 'PiralInstanceWebpackPlugin';

export interface PiralInstanceWebpackPluginOptions {
  variables?: Record<string, string>;
  debug?: boolean | string;
  emulator?: boolean | string;
}

export class PiralInstanceWebpackPlugin implements Plugin {
  constructor(private piralPackage: any, private options: PiralInstanceWebpackPluginOptions = {}) {}

  apply(compiler: Compiler) {
    const piralPkg = this.piralPackage;
    const { debug, emulator } = this.options;
    const environment = process.env.NODE_ENV || 'development';
    const variables = {
      ...getVariables(piralPkg, environment),
      ...this.options.variables,
    };

    if (debug) {
      variables.DEBUG_PIRAL = debug === true ? '1.0' : debug;
    }

    if (emulator) {
      variables.DEBUG_PILET = emulator === true ? '/$pilet-api' : emulator;
    }

    const plugins = [new DefinePlugin(getDefineVariables(variables))];

    setEnvironment(variables);

    plugins.forEach(plugin => plugin.apply(compiler));

    compiler.hooks.afterEnvironment.tap(pluginName, () => {});
  }
}
