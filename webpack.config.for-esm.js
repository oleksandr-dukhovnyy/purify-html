const path = require('path');

module.exports = {
  entry: './src/index.esm.ts',
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `index.esm.js`,
    library: 'PurifyHTML',
    libraryTarget: 'umd',
    clean: false,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
