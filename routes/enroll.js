var express=require("express");
var connection = require('./../config');

module.exports.enroll=function(req,res){
    var users={
        "user_name":req.body.username,
        "user_type":req.body.type,
        "password":req.body.password
    }
    connection.query('INSERT INTO User SET ?',users, function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({
            status:false,
            message:'there are some error with query'
        })
      }else{
          /*res.json({
            status:true,
            data:results,
            message:'user registered sucessfully'
        })*/
        return res.redirect('/');
      }
    });
}
