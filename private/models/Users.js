module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    pangalan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    partner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tirahan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  });

  return Users;
};
