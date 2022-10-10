const { Pool, Client } = require("pg");

const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   `postgres://${process.env.AWS_DATABASE_USER}:${process.env.AWS_DATABASE_PW}@${process.env.AWS_DATABASE_HOST}:5432/${process.env.AWS_DATABASE_NAME}`
// );

const sequelize = new Sequelize(
  process.env.AWS_DATABASE_NAME,
  process.env.AWS_DATABASE_USER,
  process.env.AWS_DATABASE_PW,
  {
    host: process.env.AWS_DATABASE_HOST,
    dialect: "postgres",
  }
);

const pool = new Pool({
  user: process.env.AWS_DATABASE_USER,
  host: process.env.AWS_DATABASE_HOST,
  database: process.env.AWS_DATABASE_NAME,
  password: process.env.AWS_DATABASE_PW,
  port: process.env.AWS_DATABASE_PORT,
});

const client = new Client({
  user: process.env.AWS_DATABASE_USER,
  host: process.env.AWS_DATABASE_HOST,
  database: process.env.AWS_DATABASE_NAME,
  password: process.env.AWS_DATABASE_PW,
  port: process.env.AWS_DATABASE_PORT,
});

module.exports = { client, pool, sequelize };
