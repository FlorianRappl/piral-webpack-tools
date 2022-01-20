import * as validateOptions from 'schema-utils';
import { getOptions } from 'loader-utils';
import { Compiler } from 'webpack';

const schema = {
  type: 'object' as const,
  properties: {},
  additionalProperties: false,
};

function reloadGenerator(name: string) {
  delete require.cache[require.resolve(name)];
  return require(name);
}

export interface DependencyOptions {
  includedInParent?: boolean;
}

export default async function loader(source: string, map: string, meta: any) {
  const options = getOptions(this);

  validateOptions(schema, options, {
    name: 'Codegen Loader',
    baseDataPath: 'options',
  });

  const name = this.resourcePath;
  const compiler = this._compiler as Compiler;
  const callback = this.async();

  try {
    const generator = reloadGenerator(name);
    const content = await generator.call({
      name,
      options: {
        outDir: compiler?.options?.output?.path,
        rootDir: process.cwd(),
      },
      addDependency: (file: string, options: DependencyOptions = {}) => this.addDependency(file),
    });

    if (typeof content === 'string') {
      callback(null, content, map, meta);
    } else {
      callback(new Error('Unsupported return type from codegen.'), source);
    }
  } catch (err) {
    callback(err, source);
  }
}
