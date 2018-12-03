var connection = require('./../config');
var express = require("express");

module.exports.login = function(req, res) {
  var patient_id = req.session.user_id;
  var insurance_type = req.body.insurance_type;


  connection.query('UPDATE Patient set insurance_type = ? WHERE user_id = ?', [insurance_type, patient_id], function(error, results, fields) {
    if (error) {
      res.json({
        status: false,
        message: 'there are some error with query'
      })
    } else {
      res.json({
        status: true,
        message: "Insurance updated"
      });
    }
  });
}
