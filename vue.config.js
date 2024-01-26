const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        devtool: 'source-map'
    },
    css: {
        sourceMap: true
    }
});
