'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('application', {
    appId: {
      type: DataTypes.STRING,
      field: 'appId',
      primaryKey: true
    },
    secret: {
      type: DataTypes.STRING,
      field: 'secret',
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      field: 'name',
      allowNull: false
    },
    owner: {
      type: DataTypes.STRING,
      field: 'owner',
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      field: 'description',
      allowNull: false
    },
    gatewaySecret: {
      type: DataTypes.STRING,
      field: 'gatewaySecret',
      allowNull: false
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