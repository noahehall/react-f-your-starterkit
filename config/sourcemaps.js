/* eslint-disable */
export default function sourceMap(options) {
  return {
        devtool: options.isDev
          ? 'eval-source-map'
          // recommended for production
          : 'source-map'
        }
};
