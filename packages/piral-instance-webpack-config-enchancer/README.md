<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# piral-instance-webpack-config-enchancer

The `piral-instance-webpack-config-enchancer` helps you to build Piral instances using Webpack.

## Getting Started

To begin, you'll need to install `piral-instance-webpack-config-enchancer`:

```sh
npm install piral-instance-webpack-config-enchancer --save-dev
```

Then enchance your `webpack` config. For example:

**webpack.config.js**

```js
const { piralInstanceWebpackConfigEnchancer } = require("piral-instance-webpack-config-enchancer");
const piralPkg = require("./package.json");

const excludedDependencies = ["piral", "piral-core", "piral-base", piralPkg.name];
const dependencies = piralPkg.pilets?.externals ?? [];
const externals = dependencies.filter((m) => !excludedDependencies.includes(m));

const enchance = piralInstanceWebpackConfigEnchancer({
    name: piralPkg.name,
    version: piralPkg.version,
    externals,
});

module.exports = enchance({
    /* your webpack config here*/
});
```

And run `webpack` via your preferred method.

## Options

### `variables`

Allows supplying additional variables to be used as definitions. Similar to the `definePlugin`.

Example:

```js
const { piralInstanceWebpackConfigEnchancer } = require("piral-instance-webpack-config-enchancer");
const piralPkg = require("./package.json");

const excludedDependencies = ["piral", "piral-core", "piral-base", piralPkg.name];
const dependencies = piralPkg.pilets?.externals ?? [];
const externals = dependencies.filter((m) => !excludedDependencies.includes(m));

const enchance = piralInstanceWebpackConfigEnchancer({
    name: piralPkg.name,
    version: piralPkg.version,
    externals,
    variables: {
        PIRAL_CLI_VERSION: require("piral-cli/package.json").version,
    },
});

module.exports = enchance({
    /* your webpack config here*/
});
```

### `debug`

Defines the version of the general debugging tools, if any. Setting `true` will auto-determine the version. Setting `false` or omitting will not include general debugging tools.

Example:

```js
const { piralInstanceWebpackConfigEnchancer } = require("piral-instance-webpack-config-enchancer");
const piralPkg = require("./package.json");

const excludedDependencies = ["piral", "piral-core", "piral-base", piralPkg.name];
const dependencies = piralPkg.pilets?.externals ?? [];
const externals = dependencies.filter((m) => !excludedDependencies.includes(m));

const enchance = piralInstanceWebpackConfigEnchancer({
    name: piralPkg.name,
    version: piralPkg.version,
    externals,
    debug: true,
});

module.exports = enchance({
    /* your webpack config here*/
});
```

### `emulator`

Defines the path of the emulator pilet API, if any. Setting `true` will take the default path. Setting `false` or omitting will not include the emulator pilet API call.

Example:

```js
const { piralInstanceWebpackConfigEnchancer } = require("piral-instance-webpack-config-enchancer");
const piralPkg = require("./package.json");

const excludedDependencies = ["piral", "piral-core", "piral-base", piralPkg.name];
const dependencies = piralPkg.pilets?.externals ?? [];
const externals = dependencies.filter((m) => !excludedDependencies.includes(m));

const enchance = piralInstanceWebpackConfigEnchancer({
    name: piralPkg.name,
    version: piralPkg.version,
    externals,
    emulator: "/$pilet-api",
});

module.exports = enchance({
    /* your webpack config here*/
});
```

## Contributing

Contributions in any form are appreciated and much welcome!

Just make sure to post an issue or reach out to me on [Gitter](https://gitter.im/piral-io/community) before starting actual work on anything. It really helps to avoid problems.

## License

This plugin is released using the MIT license.

[npm]: https://img.shields.io/npm/v/piral-instance-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/piral-instance-webpack-plugin
[node]: https://img.shields.io/node/v/piral-instance-webpack-plugin.svg
[node-url]: https://nodejs.org
[chat]: https://img.shields.io/badge/gitter-piral.io%2Fcommunity-brightgreen.svg
[chat-url]: https://gitter.im/piral-io/community
[size]: https://packagephobia.now.sh/badge?p=piral-instance-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=piral-instance-webpack-plugin
