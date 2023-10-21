'use strict';
const {Model} = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: 'userId',
        as: 'posts'
      });
    }
    // You can also define instance level methods here if needed
  }
  User.init({
    username: {
      type:DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {

    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.hashedPassword = await bcrypt.hash(user.hashedPassword, salt);
      }
    },

    sequelize,
    modelName: 'User',
  });
  return User;
};