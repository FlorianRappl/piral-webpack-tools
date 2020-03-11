export function getInfos() {
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
