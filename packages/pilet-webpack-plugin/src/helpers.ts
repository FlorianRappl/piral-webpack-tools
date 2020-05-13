import { existsSync, readFileSync, writeFileSync } from 'fs';

export function wrapPilet(file: string, prName: string) {
  if (existsSync(file)) {
    const template = readFileSync(file, 'utf8');
    const content = template.replace(
      /^\!function\s?\(e,\s?t\)\s?\{/m,
      `!function(e,t){function define(d,k){(typeof document!=='undefined')&&(document.currentScript.app=k.apply(null,d.map(window.${prName})));}define.amd=!0;`,
    );

    writeFileSync(file, content);
  }
}

export function getVariables(piletPkg: any, env: string): Record<string, string> {
  return {
    NODE_ENV: env,
    BUILD_TIME: new Date().toDateString(),
    BUILD_TIME_FULL: new Date().toISOString(),
    BUILD_PCKG_VERSION: piletPkg.version,
    BUILD_PCKG_NAME: piletPkg.name,
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
