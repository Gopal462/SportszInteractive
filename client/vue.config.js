module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // The backend server
        changeOrigin: true,
        pathRewrite: { '^/api': '' }, // Remove /api from the request path before sending it to the backend
      },
    },
  },
};
