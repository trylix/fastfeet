module.exports = {
  sequelize: {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'postgres',
    database: 'fastfeet',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  },
};
