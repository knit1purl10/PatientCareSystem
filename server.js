var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var connection = require('./config');
var app = express();

var loginController = require('./routes/enroll');
var login = require('./routes/login');
var paymentController = require('./routes/payment');

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

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

app.route('/enroll')
  .get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + '/public/enroll.html');
  })
/*, function (req, res) {
   res.sendFile( __dirname + "/public/" + "enroll.html" );
})*/

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
        res.redirect('/login');
    }
});

app.get('/payment', function(req, res) {
  res.sendFile(__dirname + "/public/" + "payment.html");
})

/* route to handle login and registration */
app.post('/api/enroll', loginController.enroll);
app.post('/api/login', login.login);
app.post('/api/payment', paymentController.makepayment);

console.log(paymentController);
app.post('/routes/enroll', loginController.enroll);
app.post('/routes/login', login.login);
app.post('/routes/payment', paymentController.makepayment);
app.listen(8012);
