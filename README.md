# piral-cli-webpack

![Azure Build Status](https://dev.azure.com/FlorianRappl/piral-cli-plugins/_apis/build/status/FlorianRappl.piral-cli-webpack?branchName=master) ![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)

Plugin for the `piral-cli`. Adds command line options to debug or build using webpack.

Integrates webpack for debugging and building **pilets**. You can customize the webpack config or use any webpack plugin you'd like to.

> In the future this plugin may support **Piral instances**, too.

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

- `awesome-typescript-loader`,
- `file-loader`,
- `source-map-loader`,
- `terser-webpack-plugin`,
- `webpack`, and
- `webpack-dev-server`.

### Building and Running

Building a pilet is as simple as calling:

```sh
pilet build-wp
```

Likewise, running the dev server is just as simple:

```sh
pilet debug-wp
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

## License

This plugin is released using the MIT license. For more information see the [LICENSE file](LICENSE).
