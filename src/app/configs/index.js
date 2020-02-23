const configs = {
  app: {
    port: process.env.PORT || 8080
  },
  mongodb: {
    debug: process.env.MONGODB_DEBUG || true
  },
  express: {
    requestLimit: {
      // limit http request to the server
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 900 // limit each IP to 900 requests per windowMs (60 request / minute)
    }
  }
};

export default configs;
