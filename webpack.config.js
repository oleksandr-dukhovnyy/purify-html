const path = require('path');

module.exports = {
  entry: {
    esm: './lib/index.esm.js',
    browser: './lib/index.browser.js',
  },
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `index.[name].js`,
    library: 'PurifyHTML',
    libraryTarget: 'umd',
    clean: true,
  },
  module: {
    rules: [
      // use babel-loader only in *.browser.js build
      {
        test: /\.browser\.js$/,
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
