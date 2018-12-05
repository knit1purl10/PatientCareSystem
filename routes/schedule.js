var connection = require('./../config');
var express = require("express");

module.exports.schedule = function(req, res) {
  var patientid, doctor_id, date;
  if (req.session.userprofile == 'Administrator') {
    patientid = req.body.patient;
    doctor_id = req.body.doctor;
  } else {
    patientid = req.session.user_id;
    doctor_id = null;
  }
  var appointment_type = req.body.appointment_type;
  if (req.body.appointment_type == 'Scheduled') {
    date = req.body.date.slice(0, 19).replace('T', ' ')+':00';
  } else {
    date = Date.now();
  }

  var notes = req.body.notes;
  var purpose = req.body.purpose;

  connection.query('INSERT INTO Visit (patient_id, doctor_id, visit_start_time, visit_type, purpose) \
    SELECT * FROM (SELECT ?,?,?,?,?) as tmp WHERE NOT EXISTS (select patient_id, doctor_id, visit_start_time \
      from Visit where (patient_id =? and date(visit_start_time) = date(?)) \
      or (doctor_id = ? and visit_start_time != ?)) LIMIT 1', [patientid, date, appointment_type, purpose, patientid, date,doctor_id,date], function(error, results, fields) {
    if (error) {
      console.log(error);
      res.json({
        status: false,
        message: 'there are some error with query'
      })
    } else {
      res.json({
        status: true,
        message: 'successfully scheduled'
      })

    }
  });
}
