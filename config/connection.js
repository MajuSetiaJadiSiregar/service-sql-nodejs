var mysql2 = require("mysql2");


var connection = mysql2.createConnection(
   {
      host : "localhost",
      user : "root",
      password : "",
      database : "devpkkmy_pekaka2021",
      connectionLimit : 10000
   }
);

connection.connect( function(err){
   if(err) throw err;
   console.log("databasse connecfgat");
});

module.exports = connection;