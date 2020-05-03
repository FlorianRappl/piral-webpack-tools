[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# Piral Webpack Tools

![Azure Build Status](https://dev.azure.com/FlorianRappl/piral-cli-plugins/_apis/build/status/FlorianRappl.piral-cli-webpack?branchName=master) ![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)

This repository contains the packages used to enable Webpack support in Piral. We support multiple options.

## Options

The easiest option is to use the `piral-cli` and install another dev dependency `piral-webpack-plugin`.

```sh
npm i piral-webpack-plugin --save-dev
```

Now new commands such as `piral build-wp` or `pilet build-wp` can be used. For details, see the [plugin's README](./packages/piral-webpack-plugin/README.md).

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

## Further Reading

For development:
- https://github.com/adierkens/webpack-inject-plugin/blob/master/src/main.ts
- https://webpack.js.org/contribute/plugin-patterns/

For improved config:
- https://github.com/TypeStrong/fork-ts-checker-webpack-plugin
- https://github.com/namics/webpack-config-plugins/blob/master/packages/asset-config-webpack-plugin/src/AssetConfigWebpackPlugin.js

## License

The code here is released using the MIT license. For more information see the [LICENSE file](LICENSE).
