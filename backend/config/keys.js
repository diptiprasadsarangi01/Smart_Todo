export default {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV ,

  // MongoDB
  mongoURI: process.env.MONGO_URI,

  // JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE ,

  // OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,


  // Redis
  redisURL: process.env.REDIS_URL,

  // AI Assistant
  aiApiKey: process.env.AI_API_KEY,
  aiModel: process.env.AI_MODEL ,
};
