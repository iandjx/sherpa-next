/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    config.resolve.fallback ==
      {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
        http: require.resolve("http-browserify"),
        https: require.resolve("https-browserify"),
        url: require.resolve("url"),
        os: require.resolve("os-browserify/browser"),
      };
    config.plugins.push(
      new webpack.ProvidePlugin({
        process: "process/browser.js",
        Buffer: ["buffer", "Buffer"],
      })
    );
    return config;
  },
};
