'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('user', {
    mercuryId: {
      type: DataTypes.STRING,
      field: 'mercuryId',
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      field: 'email',
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      field: 'password',
      unique: true
    },
    displayName: {
      type: DataTypes.STRING,
      field: 'displayName'
    },


    createdAt: {
      type: DataTypes.DATE,
      field: 'createdAt'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updatedAt'
    }

  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};