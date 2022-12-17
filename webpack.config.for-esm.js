const path = require('path');

module.exports = {
  entry: './lib/index.esm.js',
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `index.esm.js`,
    library: 'PurifyHTML',
    libraryTarget: 'umd',
    clean: false,
  },
};
