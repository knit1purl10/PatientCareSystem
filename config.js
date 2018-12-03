// Load module
var mysql = require('mysql');
// Initialize pool
var connection      =    mysql.createConnection({
    host     : 'gatechfall2018.cqpbxjpspvaw.us-east-1.rds.amazonaws.com',
    user     : 'admin',
    password : 'adminpassword',
    database : 'patient_care_system'
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected");
} else {
    console.log(err);
    console.log("Error while connecting with database");
}
});
module.exports = connection;
