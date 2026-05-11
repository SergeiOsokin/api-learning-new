/* eslint-disable radix */

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'develop',
  PORT: process.env.PORT || 3000,
  PORT_WS: process.env.PORT_WS || 3001,
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:12345OSV@localhost:5630/learning_new',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  EMAIL_LOGIN: process.env.EMAIL_LOGIN || process.env.EMAIL_LOGIN,
  EMAIL_SECRET: process.env.EMAIL_SECRET || process.env.EMAIL_SECRET,
  EMAIL_HOST: process.env.EMAIL_HOST || process.env.EMAIL_HOST,
};
