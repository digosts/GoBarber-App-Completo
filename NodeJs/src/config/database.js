require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  /* host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME, */

  host: 'apigobarber.postgres.uhserver.com',
  port: '5432',
  username: 'apigobarber',
  password: 'R0d4ig02@2@',
  database: 'apigobarber',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  ssl: true,
};
