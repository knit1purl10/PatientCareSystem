var connection = require('./../config');
var express = require("express");

module.exports.patientInsuranceUpdate = function(req, res) {
  var patient_id = req.session.user_id;
  var insurance_type = req.body.insurance_type;


  connection.query('UPDATE Patient set insur_type = ? WHERE user_id = ?', [insurance_type, patient_id], function(error, results, fields) {
    if (error) {
      console.log(error);
      res.json({
        status: false,
        message: 'there are some error with query'
      })
    } else {
      /*res.json({
        status: true,
        message: "Insurance updated"
      });*/
      return res.redirect('/insurance');
    }
  });
}
