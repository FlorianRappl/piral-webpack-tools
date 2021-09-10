[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# Piral Webpack Tools

![Azure Build Status](https://dev.azure.com/FlorianRappl/piral-cli-plugins/_apis/build/status/FlorianRappl.piral-cli-webpack?branchName=master) ![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)

This repository contains the packages used to enable Webpack support in Piral. We support multiple options.

## Options

### Using the Piral CLI

The easiest option is to use the `piral-cli` and install another dev dependency `piral-cli-webpack`.

```sh
npm i piral-cli-webpack --save-dev
```

The existing build, debug, and publish commands will now just work with Webpack.

For details, see the [plugin's README](./packages/pilet-webpack-plugin/README.md).

### Using Webpack Directly

If you want to fully configure Webpack yourself you can just leverage either

```sh
npm i piral-instance-webpack-plugin --save-dev
```

for your Piral instance, or

```sh
npm i pilet-webpack-plugin --save-dev
```

for pilets.

There are also standalone plugins for things such as support for `.codegen` files or using HTML as an entry module in Webpack.

## License

The code here is released using the MIT license. For more information see the [LICENSE file](LICENSE).
