const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/database');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');

//how can i make this avilable in every page?   const { check, validationResult } = require('express-validator/check');



mongoose.connect(config.database, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('database connected');
});


//Global variables 
app.locals.errors = null;


app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');


//express-validator
app.use(expressValidator());
//express-messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
//express-session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const port = 3000;

//routes 
const pages = require('./routes/pages');
const adminPages = require('./routes/admin_pages');
const adminCategories = require('./routes/admin_categories');
app.use('/admin/pages',adminPages);
app.use('/admin/categories',adminCategories);
app.use('/',pages);

app.listen(port,()=>{
    console.log('server started at '+port);
})