// next.config.js
const path = require('path')

module.exports = {
    experimental: {
      esmExternals: true,
      appDir: './src/app'
    },
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, 'src'),
      }
      return config
    }
  
  };