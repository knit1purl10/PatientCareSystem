var connection = require('./../config');
var express=require("express");

module.exports.login=function(req,res){
    var email=req.body.username;
    var password=req.body.password;


    connection.query('SELECT * FROM User WHERE user_name = ?',[email], function (error, results, fields) {
      if (error) {
          res.json({
            status:false,
            message:'there are some error with query'
            })
      }else{

        if(results.length >0){
            if(password==results[0].password){
                /*res.json({
                    status:true,
                    message:'successfully authenticated'
                })*/
                res.redirect('/dashboard.html');
            }else{
                res.json({
                  status:false,
                  message:"Username and password does not match"
                 });
            }

        }
        else{
          res.json({
              status:false,
            message:"Username does not exits"
          });
        }
      }
    });
}
