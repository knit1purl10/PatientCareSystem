var connection = require('./../config');
var express = require('express');
var router = express.Router();

exports.list = function(req, res) {

  connection.query('SELECT p.visit_id, p.payment_id, \
      p.payment_method, p.amount, v.purpose, v.doctor_id\
      FROM Payment as p INNER JOIN Visit as v \
      ON p.visit_id = v.visit_id \
      WHERE user_id = ? ORDER BY v.visit_start_time DESC', [req.session.user_id], function(err, rows) {
    if (err)
      console.log("Error Selecting : %s ", err);

    res.render('viewSchedule', {
      page_title: "View Payment History",
      data: rows
    });
  });
};
