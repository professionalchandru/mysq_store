const mysql                             = require('mysql');

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

    console.log('connected to MYSQL DB');

  })

  module.exports.con= con;
