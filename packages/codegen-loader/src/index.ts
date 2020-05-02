import validateOptions from 'schema-utils';
import { getOptions } from 'loader-utils';

const schema = {
  type: 'object',
  properties: {},
  additionalProperties: false,
};

export default async function loader(source: string, map: string, meta: any) {
  const options = getOptions(this);

  validateOptions(schema, options, {
    name: 'Codegen Loader',
    baseDataPath: 'options',
  });

  const name = this.resourcePath;
  const callback = this.async();

  delete require.cache[require.resolve(name)];

  const generator = require(name);
  const content = generator.call(this);
  const value = await Promise.resolve(content);

  if (typeof value === 'string') {
    callback(null, value, map, meta);
  } else {
    callback(new Error('Unsupported return type from codegen.'), source);
  }
}
