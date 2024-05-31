var express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

//Importing routers
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const indexRoutes = require('./routes/index');

var app = express();
app.set('views','templates');
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('static_files'));
app.use('/css',express.static(__dirname + '/static_files/css'))
app.use('/js',express.static(__dirname + '/static_files/js'))
app.use('/css',express.static(__dirname + '/static_files/images'))


app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);


app.listen(3000, ()=>{
    console.log("Express is running");
});