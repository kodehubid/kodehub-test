const configs = {
  app: {
    port: process.env.PORT || 8080
  },
  mongodb: {
    debug: process.env.MONGODB_DEBUG || true
  }
};

export default configs;
