const path = require('path');

module.exports = {
  entry: './lib/index.browser.js',
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `index.browser.js`,
    library: {
      name: 'PurifyHTML',
      type: 'assign-properties',
    },
    clean: false,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },
};
