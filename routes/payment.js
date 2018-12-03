var express=require("express");
var connection = require('./../config');

module.exports.makepayment=function(req,res){
    var payment={
        "user_id":,
        "visit_id":,
        "payment_id":req.body.bill_id,
        "amount":req.body.amount,
        "payment_method":req.body.pmethod
    }
    connection.query('INSERT INTO Payment SET ?',payment, function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({
            status:false,
            message:'there are some error with query'
        })
      }else{
          res.json({
            status:true,
            data:results,
            message:'user registered sucessfully'
        })
        res.redirect('/login.html')
      }
    });
}
