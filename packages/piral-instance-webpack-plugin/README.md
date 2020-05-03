<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# piral-instance-webpack-plugin

The `piral-instance-webpack-plugin` helps you to build Piral instances using Webpack.

## Getting Started

To begin, you'll need to install `piral-instance-webpack-plugin`:

```console
$ npm install piral-instance-webpack-plugin --save-dev
```

Then add the plugin to your `webpack` config. For example:

**webpack.config.js**

```js
const { PiralInstanceWebpackPlugin } = require('piral-instance-webpack-plugin');
const piralPkg = require('./package.json');

module.exports = {
  plugins: [new PiralInstanceWebpackPlugin(piralPkg)],
};
```

And run `webpack` via your preferred method.

## Options

### `variables`

Allows supplying additional variables to be used as definitions. Similar to the `definePlugin`.

Example:

```js
const { PiralInstanceWebpackPlugin } = require('piral-instance-webpack-plugin');
const piralPkg = require('./package.json');

module.exports = {
  plugins: [
    new PiralInstanceWebpackPlugin(piralPkg, {
      variables: {
        PIRAL_CLI_VERSION: require('piral-cli/package.json').version,
      },
    }),
  ],
};
```

### `debug`

Defines the version of the general debugging tools, if any. Setting `true` will auto-determine the version. Setting `false` or omitting will not include general debugging tools.

Example:

```js
const { PiralInstanceWebpackPlugin } = require('piral-instance-webpack-plugin');
const piralPkg = require('./package.json');

module.exports = {
  plugins: [
    new PiralInstanceWebpackPlugin(piralPkg, {
      debug: true,
    }),
  ],
};
```

### `emulator`

Defines the path of the emulator pilet API, if any. Setting `true` will take the default path. Setting `false` or omitting will not include the emulator pilet API call.

Example:

```js
const { PiralInstanceWebpackPlugin } = require('piral-instance-webpack-plugin');
const piralPkg = require('./package.json');

module.exports = {
  plugins: [
    new PiralInstanceWebpackPlugin(piralPkg, {
      emulator: '/$pilet-api',
    }),
  ],
};
```

## Contributing

Contributions in any form are appreciated and much welcome!

Just make sure to post an issue or reach out to me on [Gitter](https://gitter.im/piral-io/community) before starting actual work on anything. It really helps to avoid problems.

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/piral-instance-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/piral-instance-webpack-plugin
[node]: https://img.shields.io/node/v/piral-instance-webpack-plugin.svg
[node-url]: https://nodejs.org
[chat]: https://img.shields.io/badge/gitter-piral.io%2Fcommunity-brightgreen.svg
[chat-url]: https://gitter.im/piral-io/community
[size]: https://packagephobia.now.sh/badge?p=piral-instance-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=piral-instance-webpack-plugin
