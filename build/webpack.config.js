const path = require('path');

module.exports = {
  entry: './dist/index.js',
  output: {
    path: path.resolve(process.cwd(), './dist/'),
    filename: 'bundle.js',
  },
};