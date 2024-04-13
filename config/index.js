require("dotenv").config();

module.exports = {
  DB: process.env.APP_DB,
  PORT: process.env.APP_PORT,
  SECRET: process.env.APP_SECRET,
  CLIENT_ID: process.env.CLIENT_ID,
  APP_SECRET: process.env.APP_SECRET,
  ATLAS_URL: process.env.ATLAS_URL,
};