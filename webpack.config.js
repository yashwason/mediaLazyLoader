const path = require(`path`);

module.exports = {
    entry: {
        index: [`babel-polyfill`, `./index.js`]
    },
    output: {
        filename: `[name]-bundle.js`,
        path: path.resolve(__dirname, `public/scripts`)
    },
    module: {
        rules: [{
            test: /\.js$/,
            type: 'javascript/auto',
            exclude: /node_modules/,
            use: {
                loader: `babel-loader`,
                options: {
                    plugins: [`transform-object-rest-spread`]
                }
            }
        }]
    },
    devServer: {
        publicPath: `/scripts/`,
        contentBase: path.resolve(__dirname, `public`),
        watchContentBase: true,
        compress: true,
        port: 3000
    }
}