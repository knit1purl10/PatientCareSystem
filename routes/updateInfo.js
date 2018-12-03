var connection = require('./../config');
var express = require("express");

module.exports.updateInfo = function(req, res) {
  console.log(req.session.user);
  var user_id = req.session.user_id;
  var fname = req.body.firstname;
  var lname = req.body.lastname;
  var dob = req.body.dob;
  var gender = req.body.gender;
  var addr1 = req.body.addr1;
  var addr2 = req.body.addr2;
  var city = req.body.city;
  var state = req.body.state;
  var zipcode = req.body.zip;
  var phone = req.body.phone;

  connection.query('insert into patient_care_system.Patient (user_id,first_name,last_name,date_of_birth,gender,address_line1,address_line2, \
city,state,zip_code,phone_number) VALUES (?,?,?,?,?,?,?,?,?,?,?)\
on duplicate key update user_id=?,first_name = ?,last_name = ?,date_of_birth=?,gender=?,address_line1 = ?,\
address_line2=?,city=?,state=?,zip_code=?,phone_number=?', [user_id,fname, lname, dob, gender, addr1, addr2, city, state, zipcode,phone, user_id,fname, lname, dob, gender, addr1, addr2, city, state, zipcode,phone], function(error, results, fields) {
    if (error) {
      console.log(error);
      res.json({
        status: false,
        message: 'there are some error with query'
      })
    } else {
      //pass back success message
      return res.redirect('/dashboard');

    }
  });
}
