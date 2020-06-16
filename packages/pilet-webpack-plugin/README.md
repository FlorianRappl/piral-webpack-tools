<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# pilet-webpack-plugin

The `pilet-webpack-plugin` helps you to build pilets using Webpack.

## Getting Started

To begin, you'll need to install `pilet-webpack-plugin`:

```sh
npm install pilet-webpack-plugin --save-dev
```

Then add the plugin to your `webpack` config. For example:

**webpack.config.js**

```js
const { PiletWebpackPlugin } = require('pilet-webpack-plugin');
const piletPkg = require('./package.json');

module.exports = {
  plugins: [
    new PiletWebpackPlugin({
      name: piletPkg.name,
      version: piletPkg.version,
      piral: piletPkg.piral.name,
    }),
  ],
};
```

And run `webpack` via your preferred method.

## Options

### `variables`

Allows supplying additional variables to be used as definitions. Similar to the `definePlugin`.

Example:

```js
const { PiletWebpackPlugin } = require('pilet-webpack-plugin');
const piletPkg = require('./package.json');

module.exports = {
  plugins: [
    new PiletWebpackPlugin({
      name: piletPkg.name,
      version: piletPkg.version,
      piral: piletPkg.piral.name,
      variables: {
        PIRAL_CLI_VERSION: require('piral-cli/package.json').version,
      },
    }),
  ],
};
```

## Contributing

Contributions in any form are appreciated and much welcome!

Just make sure to post an issue or reach out to me on [Gitter](https://gitter.im/piral-io/community) before starting actual work on anything. It really helps to avoid problems.

## License

This plugin is released using the MIT license.

[npm]: https://img.shields.io/npm/v/pilet-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/pilet-webpack-plugin
[node]: https://img.shields.io/node/v/pilet-webpack-plugin.svg
[node-url]: https://nodejs.org
[chat]: https://img.shields.io/badge/gitter-piral.io%2Fcommunity-brightgreen.svg
[chat-url]: https://gitter.im/piral-io/community
[size]: https://packagephobia.now.sh/badge?p=pilet-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=pilet-webpack-plugin
