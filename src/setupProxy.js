const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/kakao-maps", // 프록시 경로
    createProxyMiddleware({
      target: "https://dapi.kakao.com",
      changeOrigin: true,
      pathRewrite: {
        "^/kakao-maps": "",
      },
    })
  );

  app.use(
    "/firebase",
    createProxyMiddleware({
      target: "https://firebasestorage.googleapis.com",
      changeOrigin: true,
      pathRewrite: {
        "^/firebase": "",
      },
    })
  );
};
