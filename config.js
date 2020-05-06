const mysql                             = require('mysql');

/**
 * MYSQL  DB connection establishment
 */
let connection = mysql.createConnection(

  {host: process.env.HOST,

  user: process.env.USER,

  password: process.env.PASSWORD

});

/**
 * Connection string for mysql database
 */
connection.connect((err)=>{

  if(err) throw err;

  console.log("Connected from config.js");

})

/**
 * Create database if not eixsts
 */
connection.query("CREATE DATABASE IF NOT EXISTS store",(err,result)=>{

  if(err) throw err;

  console.log("Database Created");

});

// /**
//  * End current database connection for open new connection with database
//  */
// connection.end((err)=>{

//   if(err) throw err

//   console.log('connectoin closed successfully');

// })

module.exports.connection = connection;

