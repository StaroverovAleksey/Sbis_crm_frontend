const path = require(`path`);
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`);
const CopyWebpackPlugin = require(`copy-webpack-plugin`);

module.exports = {
  entry: `./src/index.js`,
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `public`)
  },
  devServer: {
    contentBase: path.join(__dirname, `public`),
    compress: false,
    port: 1337
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: `babel-loader`,
        },
      },
      {
        test: /\.css$/,
        use: [
          {loader: MiniCssExtractPlugin.loader},
          `css-loader`,
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: `file-loader`
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `styles.css`
    }),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, `src/images`),
      to: path.join(__dirname, `public/images`)
    }])
  ],
  devtool: `source-map`
};
