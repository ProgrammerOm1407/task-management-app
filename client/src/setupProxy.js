// This proxy configuration is no longer used since we're connecting directly to the Render API
// Keeping this file for reference in case we need to switch back to local development

/*
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      logLevel: 'debug',
    })
  );
};
*/

// Empty export to avoid errors
module.exports = function(app) {};