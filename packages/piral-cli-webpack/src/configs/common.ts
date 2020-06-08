import chalk from 'chalk';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve } from 'path';
import { RuleSetRule, ProgressPlugin, optimize } from 'webpack';

export function getEnvironment() {
  const env = process.env.NODE_ENV || 'development';
  const develop = env === 'development';
  const production = env === 'production';

  return {
    develop,
    production,
  };
}

export function getPlugins(plugins: Array<any>, progress: boolean, production: boolean) {
  const otherPlugins = [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ];

  if (progress) {
    otherPlugins.push(
      new ProgressPlugin((percent, msg) => {
        percent = Math.floor(percent * 100);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);

        if (percent !== undefined) {
          process.stdout.write(' (');

          for (let i = 0; i <= 100; i += 10) {
            if (i <= percent) {
              process.stdout.write(chalk.greenBright('#'));
            } else {
              process.stdout.write('#');
            }
          }

          process.stdout.write(`) ${percent}% : `);
          process.stdout.write(`${chalk.cyanBright(msg)}`);

          if (percent === 100) {
            process.stdout.write(`${chalk.cyanBright('Complilation completed\n')}`);
          }
        }
      }),
    );
  }

  if (production) {
    otherPlugins.push(new optimize.OccurrenceOrderPlugin(true));
  }

  return plugins.concat(otherPlugins);
}

export function getStyleLoader() {
  return process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader;
}

export function getRules(baseDir: string): Array<RuleSetRule> {
  const styleLoader = getStyleLoader();

  const PATH_DELIMITER = '[\\\\/]'; // match 2 antislashes or one slash
  /**
   * On Windows, the Regex won't match as Webpack tries to resolve the
   * paths of the modules. So we need to check for \\ and /
   */
  const safePath = (module) => module.split('/').join(PATH_DELIMITER);
  const generateExcludes = (modules) => {
    return [
      new RegExp(
        `node_modules${PATH_DELIMITER}(?!(${modules.map(safePath).join('|')})(${PATH_DELIMITER}|$)(?!.*node_modules))`,
      ),
    ];
  };
  // In Monorepo mode, failed to accurately match the real node_modules directory
  const nodeModules = generateExcludes(['fbjs']);

  return [
    {
      test: /\.(png|jpe?g|gif|bmp|avi|mp4|mp3|svg|ogg|webp|woff2?|eot|ttf|wav)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            esModule: false,
          },
        },
      ],
    },
    {
      test: /\.s[ac]ss$/i,
      use: [styleLoader, 'css-loader', 'sass-loader'],
    },
    {
      test: /\.css$/i,
      use: [styleLoader, 'css-loader'],
    },
    {
      test: /\.m?[jt]sx?$/i,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    browsers: 'ie >= 9',
                    node: '6.1.0',
                    esmodules: false,
                  },
                  modules: false,
                  debug: true,
                  include: [],
                  exclude: [],
                  useBuiltIns: false,
                  forceAllTransforms: false,
                  shippedProposals: false,
                },
              ],
              '@babel/preset-react',
              // When ts-loader is used with `@babel/plugin-transform-runtime`, it fails to convert jsx well, for example: arrow function is not converted, so it is replaced with `@babel/preset-typescript`.
              '@babel/preset-typescript',
            ],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
                {
                  corejs: 3,
                  helpers: true,
                  regenerator: true,
                  useESModules: false,
                },
              ],
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-transform-modules-commonjs',
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
            ],
          },
        },
      ],
      exclude: nodeModules,
    },
    {
      test: /\.codegen$/i,
      use: ['parcel-codegen-loader'],
    },
    {
      test: /\.js$/i,
      use: ['source-map-loader'],
      exclude: nodeModules,
      enforce: 'pre',
    },
  ];
}
