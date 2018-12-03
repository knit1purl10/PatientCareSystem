var express = require("express");
var connection = require('./../config');

module.exports.makepayment = function(req, res) {
  console.log(req.session.user)
  connection.query('select patient_id, visit_id from Visit as v inner join User as u on v.patient_id = u.user_id where user_name = ?', req.session.user, function(error, results, fields) {
    if (results != null) {
    var payment = {
      "user_id": results[0].patient_id,
      //"visit_id":,
      "payment_id": req.body.bill_id,
      "amount": req.body.amount,
      "payment_method": req.body.pmethod
    }
    connection.query('INSERT INTO Payment SET ?', payment, function(error, results, fields) {
      if (error) {
        console.log(error);
        res.json({
          status: false,
          message: 'there are some error with query'
        })
      } else {
        /*res.json({
            status:true,
            data:results,
            message:'user registered sucessfully'
        })*/
        return res.redirect('/')
      }
    });
  } else {
    res.json({
        status:false,
        message:'No such visit exists for this patient'
    })
  }
  });
}
