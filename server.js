var express=require("express");
var bodyParser=require('body-parser');

var connection = require('./config');
var app = express();

var loginController=require('./routes/enroll');
var login = require('./routes/login');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/public/" + "login.html" );
})

app.get('/enroll', function (req, res) {
   res.sendFile( __dirname + "/public/" + "enroll.html" );
})

app.get('/dashboard', function (req, res) {
   res.sendFile( __dirname + "/public/" + "dashboard.html" );
})

/* route to handle login and registration */
app.post('/api/enroll',loginController.enroll);
app.post('/api/login',login.login);

//console.log(authenticateController);
app.post('/routes/enroll', loginController.enroll);
app.post('/routes/login', login.login);
app.listen(8012);
