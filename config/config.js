const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "emsifmdmfasdkmfalkdsmfkls",
  mongoUri:
    process.env.MONGODB_URI ||
    "mongodb+srv://rohit:rohit@cluster0.hfpne.mongodb.net/cvrrsocial?retryWrites=true&w=majority",
};

export default config;
