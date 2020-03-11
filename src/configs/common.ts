import { resolve } from 'path';
import { RuleSetRule } from 'webpack';

export function getEnvironment() {
  const env = process.env.NODE_ENV || 'development';
  const develop = env === 'development';
  const test = env === 'test';
  const production = env === 'production';

  return {
    env,
    develop,
    test,
    production,
  };
}

export function getRules(baseDir: string): Array<RuleSetRule> {
  return [
    {
      test: /\.(png|jpe?g|gif|mp4|mp3|svg|ogg|webp|wav)$/i,
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
      test: /\.tsx?$/,
      loaders: [
        {
          loader: 'awesome-typescript-loader',
          options: {
            tsconfig: resolve(baseDir, 'tsconfig.json'),
          },
        },
      ],
    },
    {
      enforce: 'pre',
      test: /\.js$/,
      loader: 'source-map-loader',
      exclude: resolve(baseDir, 'node_modules'),
    },
  ];
}
