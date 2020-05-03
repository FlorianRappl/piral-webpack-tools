[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# piral-cli-webpack

Plugin for the `piral-cli`. Adds command line options to debug or build using webpack.

Integrates webpack for debugging and building **pilets** and **Piral instances**. You can customize the webpack config or use any webpack plugin you'd like to.

## Installation

Install the plugin either locally or globally.

We recommend the local installation:

```sh
npm i piral-cli-webpack --save-dev
```

## Usage

This plugin comes with batteries included. You don't need to install or specify your Webpack version.

### What's Inside

Right now it includes:

- `babel-loader`,
- `css-loader`,
- `file-loader`,
- `source-map-loader`,
- `sass-loader`,
- `style-loader`,
- `ts-loader`,
- `html-webpack-plugin`,
- `mini-css-extract-plugin`,
- `terser-webpack-plugin`,
- `webpack`, and
- `webpack-dev-server`.

As such it should be prepared to include assets (images, videos, ...), stylesheets (CSS and SASS), and work with TypeScript.

> Right now the output of this plugin is for the **v1** pilet schema only!

No support for the legacy **v0** pilet schema.

### Building and Running a Pilet

Building a pilet is as simple as calling:

```sh
pilet build-wp
```

Likewise, running the dev server is just as simple:

```sh
pilet debug-wp
```

### Building and Running a Pilet Instance

Building a Piral instance is as simple as calling:

```sh
piral build-wp
```

This builds both, the emulator package (`dist/develop`) and the release files (`dist/release`).

Likewise, running the dev server is just as simple:

```sh
piral debug-wp
```

### Customizing

You can still leverage your own `webpack.config.js`. Either just export *what you want to have overwritten*, e.g.,

```js
module.exports = {
  devtool: 'inline-source-map',
};
```

or specify a function that is called with the already created configuration.

An example would be:

```js
module.exports = function(config) {
  config.plugins.push(myAwesomePlugin);
  config.entry.side = ['@babel/polyfill'];
  return config;
};
```

### Command Line Arguments

Besides the usual `--base` for overriding the base path (otherwise it is the current working directory) the `--config` option exists to override the path to the `webpack.config.js`.

The `debug` commands also contain a `--port` option to set a different port than `1234`.

## Contributing

Contributions in any form are appreciated and much welcome!

Just make sure to post an issue or reach out to me on [Gitter](https://gitter.im/piral-io/community) before starting actual work on anything. It really helps to avoid problems.

## License

This plugin is released using the MIT license.

[npm]: https://img.shields.io/npm/v/piral-cli-webpack.svg
[npm-url]: https://npmjs.com/package/piral-cli-webpack
[node]: https://img.shields.io/node/v/piral-cli-webpack.svg
[node-url]: https://nodejs.org
[chat]: https://img.shields.io/badge/gitter-piral.io%2Fcommunity-brightgreen.svg
[chat-url]: https://gitter.im/piral-io/community
[size]: https://packagephobia.now.sh/badge?p=piral-cli-webpack
[size-url]: https://packagephobia.now.sh/result?p=piral-cli-webpack
