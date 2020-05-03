export function getVariables(piralPkg: any, env: string): Record<string, string> {
  const excludedDependencies = ['piral', 'piral-core', 'piral-base', piralPkg.name];
  const dependencies = piralPkg.pilets?.externals ?? [];

  return {
    NODE_ENV: env,
    BUILD_TIME: new Date().toDateString(),
    BUILD_TIME_FULL: new Date().toISOString(),
    BUILD_PCKG_VERSION: piralPkg.version,
    BUILD_PCKG_NAME: piralPkg.name,
    SHARED_DEPENDENCIES: dependencies.filter((m) => !excludedDependencies.includes(m)).join(','),
  };
}

export function setEnvironment(variables: Record<string, string>) {
  Object.keys(variables).forEach((key) => (process.env[key] = variables[key]));
}

export function getDefineVariables(variables: Record<string, string>) {
  return Object.entries(variables).reduce((obj, [name, value]) => {
    obj[`process.env.${name}`] = JSON.stringify(value);
    return obj;
  }, {});
}
