module.exports = {
  dialect: 'postgres',
  host: 'apigobarber.postgres.uhserver.com',
  username: 'apigobarber',
  password: 'g0b4Rb3r*2',
  database: 'apigobarber',
  /* host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber', */
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
