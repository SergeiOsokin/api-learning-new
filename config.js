/* eslint-disable radix */

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'develop',
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:12345OSV@localhost:5630/learning_new',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
};
