const webpack = require('webpack')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = {
  entry: { index: './src/index.js' },

  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js',
    library: 'json-schema-normalizer',
    libraryTarget: 'umd'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, 'src')]
      }
    ]
  },

  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'src')
    ],
    extensions: ['.js', '.json', '.css'],
    alias: {
      'one-ui-core': path.resolve(__dirname, 'src'),
      'one-utils': path.resolve(__dirname, 'src/utils')
    }
  },

  plugins: [
    process.env.STATS &&
      new BundleAnalyzerPlugin({ analyzerPort: process.env.STATS || 9000 }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: false }),
    new webpack.optimize.AggressiveMergingPlugin()
  ].filter(Boolean),

  performance: {
    hints: 'warning',
    maxAssetSize: 20000000,
    maxEntrypointSize: 100000000
  },

  externals: {
    ajv: {
      commonjs: 'ajv',
      commonjs2: 'ajv',
      amd: 'ajv'
    },
    normalizr: {
      commonjs: 'normalizr',
      commonjs2: 'normalizr',
      amd: 'normalizr'
    }
  },

  stats: 'minimal'
}
