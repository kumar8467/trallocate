var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Config = require('./config/config');
var Cookies = require('./server/models/cookie');

var api_routes = require('./server/routes/api_routes');
var user_panel_routes = require('./server/routes/user_panel_routes');
var mongo = require('./server/helpers/mongo');
try{
    mongo.connect();
}catch(e){
    console.log(e);
}
var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets/dist')));

app.use(function(req, res, next) {
    var cookieName = req.cookies.cookieName;
    var cookieExistsCallback = function(err,result){
        console.log(result);
        if(result.length){
            req.authenticated = true
        }else{
            req.authenticated = false
        }
        next();
    };
    Cookies.find({cookieName: cookieName, sequence_value: null}, cookieExistsCallback);
});

app.all('*', function(req, res, next) {
    console.log('******** after user panel ********');
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    next();
});

app.use('/', user_panel_routes);

app.use('/api/v1', api_routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.error(err);
        res.status(err.status || 500);
        error_code = err.error_code || 100;
        res.end(JSON.stringify({
            status: "error",
            message: err.message,
            error_code: error_code,
            data: null
        }));
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.error(err);
        res.status(err.status || 500);
        error_code = err.error_code || 100;
        res.end(JSON.stringify({
            status: "error",
            message: err.message,
            error_code: error_code,
            data: null
        }));
});


module.exports = app;
