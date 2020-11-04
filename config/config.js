const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || "dfjnsdjkfndjkfndj",
  mongoUri:
    process.env.MONGODB_URI ||
    "mongodb+srv://rohit:rohit@cluster0.hfpne.mongodb.net/cvrrsocial?retryWrites=true&w=majority",
  // process.env.MONGO_HOST ||
  // "mongodb://" +
  //   (process.env.IP || "localhost") +
  //   ":" +
  //   (process.env.MONGO_PORT || "27017") +
  //   "/cvrrsocial",
};

export default config;
