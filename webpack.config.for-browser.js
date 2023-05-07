const path = require('path');

module.exports = {
  entry: './src/index.browser.ts',
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
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
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
