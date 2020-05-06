const mysql = require('mysql');

/**
 * MySQL connection establishment with database
 */
let con = mysql.createConnection({

    host: process.env.HOST,

    user: process.env.USER,

    password: process.env.PASSWORD,

    database: process.env.DATABASE

  });

  /**
   * Connection String for MYSQL connection
   */
  con.connect((err)=>{

    if(err) throw err;

    console.log('connected from db_config.js');

  })

  /**
   * End point for create Products table
   */
  exports.productsTable = con.query(`CREATE TABLE IF NOT EXISTS Products(

    id int primary key auto_increment,

    name varchar(255) not null,

    category varchar(255) not null,

    price int not null,

    quantity int not null,

    description text,

    likedBy text

  )`,(err,result,filed)=>{

    if(err) throw err;

  })

  /**
   * End point for create User table
   */
  exports.usersTable = con.query(`CREATE TABLE IF NOT EXISTS Users(

    id int primary key auto_increment,

    name varchar(255) not null,

    email varchar(255) not null,

    password text not null

  )`,(err, result, filed)=>{

    if(err) throw err;

  });

  module.exports.con= con;
