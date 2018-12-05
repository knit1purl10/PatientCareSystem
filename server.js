var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var connection = require('./config');
var app = express();
var router = express.Router();

var loginController = require('./routes/enroll');
var login = require('./routes/login');
var paymentController = require('./routes/payment');
var userInfoController = require('./routes/updateInfo');
var scheduleController = require('./routes/schedule');
var patientInsuranceController = require('./routes/insuranceUpdate');
var scheduleViewController = require('./routes/viewSchedule');

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + "/views"));

//session stuff
app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000000000
  }
}));

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});

var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/dashboard');
  } else {
    next();
  }
};

app.route('/')
  .get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
  })
//

app.get('/enroll', function(req, res) {
  res.sendFile(__dirname + "/public/" + "enroll.html");
})

app.get('/dashboard', function(req, res) {
  if (req.session.user && req.cookies.user_sid) {
    res.sendFile(__dirname + '/public/dashboard.html');
  } else {
    res.redirect('/login');
  }
})

app.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});

app.get('/payment', function(req, res) {
  res.sendFile(__dirname + "/public/" + "payment.html");
})

app.get('/updateInfo', function(req, res) {
  res.sendFile(__dirname + "/public/" + "updateInfo.html");
})

app.get('/schedule', function(req, res) {
  res.sendFile(__dirname + "/public/" + "schedule.html");
})

app.get('/schedule', function(req, res) {
  res.sendFile(__dirname + "/public/" + "schedule.html");
})

app.get('/insurance', function(req, res) {
  res.sendFile(__dirname + "/public/" + "insurance.html");
})

app.get('/history', function(req, res) {
  res.sendFile(__dirname + "/public/" + "history.html");
})

//app.get('/viewSchedule', scheduleViewController.list);

app.get("/viewSchedule", function(req, res, next) {
  res.sendFile(__dirname + "/public/" + "viewSchedule.html");
});

app.get("/patient", function(req, res, next) {
  res.sendFile(__dirname + "/public/" + "patientRecord.html");
});

app.get("/paymentHistory", function(req, res, next) {
  res.sendFile(__dirname + "/public/" + "paymentHistory.html");
});

app.get("/reports", function(req, res, next) {
  res.sendFile(__dirname + "/public/" + "reports.html");
});

app.get("/getSchedule", function(req, res) {
  var params = []
  var query = 'SELECT p.first_name as First, p.last_name as Last, v.visit_start_time as Scheduled, v.purpose as Purpose \
FROM patient_care_system.Visit as v \
left join patient_care_system.Patient as p \
on v.patient_id = p.user_id where ';
  if (req.session.userprofile == 'Doctor') {
    query += ' v.doctor_id = ? and '
    params.push(req.session.user_id)
  }
  query += 'yearweek(v.visit_start_time, 1) = yearweek(curdate(),1) \
ORDER BY v.visit_start_time';
  connection.query(query, params, function(err, rows, fs) {
    if (err) {
      console.log('Something is broken');
      console.log(err);
      console.log(fs);
    }
    res.json(rows);
  });
});

app.get("/getPatientInfo", function(req, res) {
  var params = []
  var query = 'SELECT first_name as "First Name", last_name as "Last Name", \
  DATE_FORMAT(date_of_birth, "%m/%d/%Y") as "Date of Birth", gender as Gender, \
  address_line1 as "Address 1", address_line2 as "Address 2", city as City,\
  state as State, zip_code as "Zip Code", phone_number as "Phone #" \
FROM patient_care_system.Patient where ';
  if (req.session.userprofile == 'Patient') {
    query += 'user_id = ?'
    params.push(req.session.user_id);
  } else {
    if (req.query.pid != '' && req.query.search_name != '') {
      query += 'user_id = ? and (lower(first_name) like ? or lower(last_name) like ?)'
      params.push(req.query.pid);
      params.push('%' + req.query.search_name + '%');
      params.push('%' + req.query.search_name + '%');
    } else {
      if (req.query.pid != '') {
        params.push(req.query.pid);
        query += 'user_id = ?'
      } else {
        query += '(first_name like ? or last_name like ?)'
        params.push('%' + req.query.search_name + '%');
        params.push('%' + req.query.search_name + '%');
      }
    }
    console.log(req.query.pid);
    console.log(req.query.search_name);
  }
  connection.query(query, params, function(err, rows, fs) {
    if (err) {
      console.log('Something is broken');
      console.log(err);
      console.log(fs);
    }
    res.json(rows);
  });
});

app.get("/getVisit", function(req, res) {
  var params = []
  var query = 'SELECT p.first_name as First, p.last_name as Last, \
  p.insur_type as Insurance, v.purpose as Purpose, v.note as Notes,\
  v.visit_id \
FROM patient_care_system.Visit as v \
left join patient_care_system.Patient as p \
on v.patient_id = p.user_id \
where  ';
  if (req.session.userprofile == 'Doctor') {
    query += 'and (v.doctor_id = ? or v.doctor_id is null) '
    params.push(req.session.user_id);
  }
  if (req.query.pid != '' && req.query.search_name != '') {
    query += ' p.user_id = ? and (lower(p.first_name) like ? or lower(p.last_name) like ?)'
    params.push(req.query.pid);
    params.push('%' + req.query.search_name + '%');
    params.push('%' + req.query.search_name + '%');
  } else {
    query += ' (lower(p.first_name) like ? or lower(p.last_name) like ?) '
    params.push('%' + req.query.search_name + '%');
    params.push('%' + req.query.search_name + '%');
  }
  query += 'order by v.visit_start_time limit 1;';
  connection.query(query, params, function(err, rows, fs) {
    if (err) {
      console.log('Something is broken');
      console.log(err);
      console.log(fs);
    }
    res.json(rows);
  });
});

app.post("/getTreatments", function(req, res) {
  var params = []
  var query = 'SELECT t2.trt_name as "Actions Taken" \
  from Treatment_Requested as t1 inner join Treatment as t2 \
on t1.test_id = t2.trt_number \
left join patient_care_system.Visit as v \
on t1.visit_id = v.visit_id \
where v.visit_id = ?;';
  params.push(req.body.vid);
  connection.query(query, params, function(err, rows, fs) {
    if (err) {
      console.log('Something is broken');
      console.log(err);
      console.log(fs);
    }
    console.log(rows);
    return res.json(rows);
  });
});

app.post("/closeVisit", function(req, res) {
  var params = []
  var query = 'update v set note = ?, visit_end_time = now(), visit_cost = t.total_bill \
  from Visit as v inner join (select visit_id, sum(trt_cost) as total_bill \
  from Treatment_Requested as t1 inner join Treatment as t2 \
  on t1.test_id = t2.trt_number) t on t.visit_id = v.visit_id\
              where visit_id = ?;';
  if (req.session.userprofile == 'Doctor') {
    console.log(req.body.notes);
    console.log(req.body.vid);
    params.push(req.body.notes);
    params.push(req.body.vid);
    connection.query(query, params, function(err, rows, fs) {
      if (err) {
        console.log('Something is broken');
        console.log(err);
        console.log(fs);
        res.json({
          status: false,
          message: 'there are some error with query'
        })
      }
      console.log(rows);
      return res.redirect('/patient');
    });
  }
});

app.get("/getPaymentHistory", function(req, res) {
  var params = []
  var query = 'select payment_id as "Bill ID", \
  DATE_FORMAT(visit_start_time, "%m/%d/%Y") as Date, \
  visit_cost as "Bill Amount", \
  payment_method as "Payment Method", amount as "Amount" \
FROM Payment inner join Visit \
on Payment.visit_id = Visit.visit_id \
where user_id = ? ORDER BY visit_start_time desc LIMIT 50';
  console.log(req.session.user_id);
  params.push(req.session.user_id);
  connection.query(query, params, function(err, rows, fs) {
    if (err) {
      console.log('Something is broken');
      console.log(err);
      console.log(fs);
    }
    res.json(rows);
  });
});

app.get("/getHistory", function(req, res) {
  var params = []
  var query = 'select visit_id as "Bill ID", Doctor.last_name as Doctor, \
  date_format(visit_start_time, "%m/%d/%Y") as Date, \
  visit_cost as "Total Bill" \
  from Visit \
  inner join Doctor \
  on Doctor.user_id = Visit.doctor_id \
  where patient_id = ? \
  ORDER BY visit_start_time desc LIMIT 50';
  console.log(req.session.user_id);
  params.push(req.session.user_id);
  connection.query(query, params, function(err, rows, fs) {
    if (err) {
      console.log('Something is broken');
      console.log(err);
      console.log(fs);
    }
    res.json(rows);
  });
});

app.get("/getActiveDoctors", function(req, res) {
  var params = []
  var query = 'select user_id, last_name from patient_care_system.Doctor \
  WHERE work_end_date is null;';
  connection.query(query, params, function(err, rows, fs) {
    if (err) {
      console.log('Something is broken');
      console.log(err);
      console.log(fs);
    }
    res.json(rows);
  });
});

app.get("/getReport", function(req, res) {
  var params = []
  var query = 'select user_id, last_name from patient_care_system.Doctor \
  WHERE work_end_date is null;';
  connection.query(query, params, function(err, rows, fs) {
    if (err) {
      console.log('Something is broken');
      console.log(err);
      console.log(fs);
    }
    res.json(rows);
  });
});

/* route to handle login and registration */
app.post('/api/enroll', loginController.enroll);
app.post('/api/login', login.login);
app.post('/api/payment', paymentController.makepayment);
app.post('/api/updateInfo', userInfoController.updateInfo);
app.post('/api/schedule', scheduleController.schedule);
app.post('/api/insuranceUpdate', patientInsuranceController.patientInsuranceUpdate);

//console.log(paymentController);
app.post('/routes/enroll', loginController.enroll);
app.post('/routes/login', login.login);
app.post('/routes/payment', paymentController.makepayment);
app.post('/routes/updateInfo', userInfoController.updateInfo);
app.post('/routes/schedule', scheduleController.schedule);
app.post('/routes/insuranceUpdate', patientInsuranceController.patientInsuranceUpdate);
app.listen(8012);
