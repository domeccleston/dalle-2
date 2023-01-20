module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["oaidalleapiprodscus.blob.core.windows.net"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/disabled",
        permanent: false,
      },
    ];
  },
};
