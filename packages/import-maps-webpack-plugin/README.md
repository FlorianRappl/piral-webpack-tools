<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# import-maps-webpack-plugin

The `import-maps-webpack-plugin` module for declaring / using import maps. These externals will not be bundled in directly, but only be loaded if not already present. :rocket:

It follows pretty much the [parcel-plugin-import-maps](https://www.npmjs.com/package/parcel-plugin-import-maps) implementation.

## Getting Started

### Installation

To begin, you'll need to install `import-maps-webpack-plugin`:

```sh
npm install import-maps-webpack-plugin --save-dev
```

### Import Maps Declaration

You can now add a new key to your *package.json*: `importmap`. The key can either hold an `importmap` structure (see [specification](https://wicg.github.io/import-maps/)) or a reference to a valid JSON file holding the structure.

Example for the containing the structure in the *package.json*:

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "devDependencies": {
    "webpack": "4.x",
    "import-maps-webpack-plugin": "latest"
  },
  "importmap": {
    "imports": {
      "/app/helper": "node_modules/helper/index.mjs",
      "lodash": "./node_modules/lodash-es/lodash.js"
    }
  }
}
```

Alternative version:

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "devDependencies": {
    "webpack": "4.x",
    "import-maps-webpack-plugin": "latest"
  },
  "importmap": "./my-imports.json"
}
```

where the *my-imports.json* looks like

```json
{
  "imports": {
    "/app/helper": "node_modules/helper/index.mjs",
    "lodash": "./node_modules/lodash-es/lodash.js"
  }
}
```

### Loading the Import Maps

With this equipped the given modules are loaded *asynchronously* at the beginning of the application. If multiple applications with import maps are loaded then the dependencies are either *shared* or *not shared* depending on their individual hashes.

This ensures proper dependency isolation while still being able to share what makes sense to be shared.

Most importantly, the plugin allows you to place scripts from other locations easily without bundling them in:

```json
{
  "imports": {
    "lodash": "https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js"
  }
}
```

For proper IDE (or even TypeScript) usage we still advise to install the respective package or at least its bindings locally.

### Using Asynchronous Imports

The required import maps are loaded at startup *asynchronously*. Therefore, you'd need to wait before using them.

Unfortunately, in the current version this cannot be done implicitly (reliably), even though its desired for the future.

Right now the only way is to change code like (assumes `lodash` is used from an import map like above)

```js
//app.js
import * as _ from 'lodash';

const _ = require('lodash');

export const partitions = _.partition([1, 2, 3, 4], n => n % 2);
});
```

to be

```js
//app.js
require('importmap').ready().then(() => {
  const _ = require('lodash');
  return {
    partitions: _.partition([1, 2, 3, 4], n => n % 2),
  };
});
```

or, alternatively (more generically),

```js
//index.js
module.exports = require('importmap').ready().then(() => require('./app'));

//app.js
import * as _ from 'lodash';

const _ = require('lodash');

export const partitions = _.partition([1, 2, 3, 4], n => n % 2);
});
```

You could also trigger the loading already in the beginning, i.e.,

```js
//app.js
require('importmap');

// ...
//other.js
require('importmap').ready('lodash').then(() => {
  // either load or do something with require('lodash')
});
```

where we use `ready` with a single argument to determine what package should have been loaded to proceed. This is the deferred loading approach. Alternatively, an array with multiple package identifiers can be passed in.

## Options

(No options yet.)

## Examples

The following examples show how one might use `import-maps-webpack-plugin` and what the result would be.

### Including Import Maps Support

Using the plugin is as simple as just importing the `ImportMapsWebpackPlugin` class and providing an instance of it to the webpack configuration.

Example:

```ts
import { ImportMapsWebpackPlugin } from 'import-maps-webpack-plugin';

module.exports = {
  // ... standard webpack
  plugins: [
    new ImportMapsWebpackPlugin(),
  ],
};
```

This will the `importmap` virtual module and its API. All dependencies are then specified as via the given import maps specification.

## Contributing

Contributions in any form are appreciated and much welcome!

Just make sure to post an issue or reach out to me on [Gitter](https://gitter.im/piral-io/community) before starting actual work on anything. It really helps to avoid problems.

## License

This plugin is released using the MIT license.

[npm]: https://img.shields.io/npm/v/import-maps-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/import-maps-webpack-plugin
[node]: https://img.shields.io/node/v/import-maps-webpack-plugin.svg
[node-url]: https://nodejs.org
[chat]: https://img.shields.io/badge/gitter-piral.io%2Fcommunity-brightgreen.svg
[chat-url]: https://gitter.im/piral-io/community
[size]: https://packagephobia.now.sh/badge?p=import-maps-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=import-maps-webpack-plugin
