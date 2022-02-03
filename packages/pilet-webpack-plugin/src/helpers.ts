import { Configuration } from 'webpack';
import { SharedDependency } from './types';

export function getVariables(name: string, version: string, env: string): Record<string, string> {
  return {
    NODE_ENV: env,
    BUILD_TIME: new Date().toDateString(),
    BUILD_TIME_FULL: new Date().toISOString(),
    BUILD_PCKG_VERSION: version,
    BUILD_PCKG_NAME: name,
  };
}

export function setEnvironment(variables: Record<string, string>) {
  Object.keys(variables).forEach(key => (process.env[key] = variables[key]));
}

export function getDefineVariables(variables: Record<string, string>) {
  return Object.entries(variables).reduce((obj, [name, value]) => {
    obj[`process.env.${name}`] = JSON.stringify(value);
    return obj;
  }, {});
}

export function getExternals(piral: string) {
  const shellPkg = require(`${piral}/package.json`);
  const piralExternals = shellPkg.pilets?.externals ?? [];
  return [
    ...piralExternals,
    '@dbeining/react-atom',
    '@libre/atom',
    'history',
    'react',
    'react-dom',
    'react-router',
    'react-router-dom',
    'tslib',
    'path-to-regexp',
  ];
}

export function getDependencies(importmap: Array<SharedDependency>, compilerOptions: Configuration) {
  const dependencies = {};
  const { entry, externals } = compilerOptions;

  if (typeof entry === 'object' && entry && Array.isArray(externals) && typeof externals[0] === 'object') {
    for (const dep of importmap) {
      dependencies[dep.id] = dep.ref;
      externals[0][dep.name] = dep.requireId || dep.id;

      if (dep.type === 'local') {
        entry[dep.ref.replace(/\.js$/, '')] = dep.entry;
      }
    }
  }

  return dependencies;
}

export function withExternals(compilerOptions: Configuration, externals: Array<string>) {
  const current = compilerOptions.externals || [];
  const arrayExternals = Array.isArray(current) ? current : [current];

  const objectExternal = externals.reduce((external, dep) => {
    external[dep] = dep;
    return external;
  }, {});

  const newExternals = arrayExternals.filter(external => {
    if (typeof external === 'object' && Object.keys(external).length) {
      for (const dep in external) {
        objectExternal[dep] = external[dep];
      }
      return false;
    }
    return true;
  });

  compilerOptions.externals = [objectExternal, ...newExternals];
}
