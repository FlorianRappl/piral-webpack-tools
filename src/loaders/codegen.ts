export default function (source: string, map: string, meta: any) {
  const name = this.resourcePath;
  const callback = this.async();
  delete require.cache[require.resolve(name)];
  const generator = require(name);
  const content = generator.call(this);

  Promise.resolve(content).then((value: string) => {
    if (typeof value === 'string') {
      callback(null, value, map, meta);
    } else {
      callback(new Error('Unsupported return type from codegen.'), source);
    }
  });
}
