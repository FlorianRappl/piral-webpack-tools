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

- `awesome-typescript-loader`,
- `file-loader`,
- `source-map-loader`,
- `sass-loader`,
- `css-loader`,
- `style-loader`,
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

## License

This plugin is released using the MIT license.
