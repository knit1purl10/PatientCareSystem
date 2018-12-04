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
    expires: 600000
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

//app.get('/viewSchedule', scheduleViewController.list);

app.get("/viewSchedule", function(req, res, next) {
   res.sendFile(__dirname + "/public/" + "viewSchedule.html");
});

app.get("/inputQuery", function(req, res) {
   connection.query('SELECT p.first_name as First, p.last_name as Last, v.visit_start_time as Scheduled, v.purpose as Purpose \
FROM patient_care_system.Visit as v \
left join patient_care_system.Patient as p \
on v.patient_id = p.user_id \
where v.doctor_id = ? \
and yearweek(v.visit_start_time, 1) = yearweek(curdate(),1) \
ORDER BY v.visit_start_time;', [req.session.user_id], function(err, rows, fs) {
      if(err) {
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
