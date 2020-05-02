import * as validateOptions from 'schema-utils';
import { getOptions } from 'loader-utils';

const schema = {
  type: 'object',
  properties: {},
  additionalProperties: false,
};

function reloadGenerator(name: string) {
  delete require.cache[require.resolve(name)];
  return require(name);
}

export default async function loader(source: string, map: string, meta: any) {
  const options = getOptions(this);

  validateOptions(schema, options, {
    name: 'Codegen Loader',
    baseDataPath: 'options',
  });

  const name = this.resourcePath;
  const callback = this.async();
  const generator = reloadGenerator(name);
  const content = await generator.call(this);

  if (typeof content === 'string') {
    callback(null, content, map, meta);
  } else {
    callback(new Error('Unsupported return type from codegen.'), source);
  }
}
