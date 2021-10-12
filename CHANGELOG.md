# Piral Webpack Tools Changelog

## 0.8.0 (September 12, 2021)

* Updated dependencies
* Support for v0 schema in `pilet-webpack-plugin`

## 0.7.0 (September 15, 2021)

* Updated dependencies
* Removed the `import-maps-webpack-plugin`
* Added support for the pilet schema v2

## 0.6.8 (May 25, 2021)

* Fixed `v0` bannerSuffix logic.

## 0.6.7 (May 5, 2021)

* Improved wiring up `html-webpack-plugin`

## 0.6.6 (January 13, 2021)

* Fixed usage of Cheerio static w.r.t. `TagElement`

## 0.6.5 (January 12, 2021)

* Improved `link` resolution in the `html5-entry-webpack-plugin`
* Updated dependencies

## 0.6.4 (September 7, 2020)

* Published `import-maps-webpack-plugin`
* Expose `html-webpack-plugin` options in `html5-entry-webpack-plugin`

## 0.6.3 (August 10, 2020)

* Improved lazy loading for pilet debug
* Updated dependencies

## 0.6.2 (July 31, 2020)

* Exclude CSS from pilet banner

## 0.6.1 (June 29, 2020)

* Allow `none` schema in `pilet-webpack-plugin`

## 0.6.0 (June 16, 2020)

* Moved `piral-cli-webpack` to the Piral repository
* The new `piral-cli-webpack` is compatible `piral-cli` v0.11.6 onwards
* Improved the API of `pilet-webpack-plugin` (breaking)
* Improved the API of `piral-instance-webpack-plugin` (breaking)

## 0.5.5 (June 9, 2020)

* Support IE11 (#20)

## 0.5.4 (June 8, 2020)

* Updated dependencies (#17)
* Changed to use flexible (relative) pilet URL (#18)

## 0.5.3 (May 17, 2020)

* Fixed bug for lazy loading in pilets
* Improved `piral debug-wp` with public path

## 0.5.2 (May 13, 2020)

* Fixed bug in definition of pilet
* Fixed asset paths for pilets
* Aligned API of `parcel-codegen-loader`

## 0.5.1 (May 11, 2020)

* Improved supported file types (#14)
* Support watch for shell in mono repos (#12)

## 0.5.0 (May 3, 2020)

* Changed to use mono repo (#5)
* Added new `parcel-codegen-loader`
* Added new `html5-entry-webpack-plugin`
* Added new `pilet-webpack-plugin`
* Added new `piral-instance-webpack-plugin`

## 0.4.1 (May 2, 2020)

* Fixed pilet entry file name in debug mode (#8)
* Fixed missing webpack configuration file name (#7)
* Fixed invalid app shell path (#6)

## 0.4.0 (May 1, 2020)

* Support for mono repos (#1)
* Avoid caching of pilets (#3)
* Fixed nested package tarballs (#4)
