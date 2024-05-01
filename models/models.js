require("dotenv").config();



const{ connect }= require("../db/connection.js")
const { Sequelize, DataTypes } = require('sequelize');



const sequelize = new Sequelize(
    process.env.DATABASE_NAME, 
    process.env.DATABASE_USER,
    process.env.DA, {
        host: process.env.DATABASE_HOST,
        dialect: 'postgres',
    });


const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  timestamp:{
    type: DataTypes.TIME,
    allowNull: true,
  },

});

// Create the table if it doesn't exist
Post.sync();

module.exports = Post;