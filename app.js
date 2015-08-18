var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require ('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz by aC'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Sesiones
app.use(function(req, res, next) {
   if(!req.path.match(/\/login|\/logout/)){
      req.session.redir = req.path;
   }

   res.locals.session = req.session;
   next();
});

// Si el usuario no realiza peticiones durante 120s sale automáticamente
app.use(function(req, res, next){
   if (req.session.user) {
      var timer = 120000;
      var actualTime = (new Date()).getTime();
      var sessionTime = (new Date (req.session.user.lastAction)).getTime();

      if ((actualTime - sessionTime) > timer) {
         delete req.session.user;
         console.log("No has hecho nada durante más de 2 minutos... SAYONARA!");
         res.redirect('/login');
      }

      else {
         req.session.user.lastAction = (new Date()).getTime();
      }
   }
   next();
});

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// #################
// MANEJO DE ERRORES
// #################
// Errores en desarrollo
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors: []
    });
  });
}

// Errores en producción
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });
});


module.exports = app;
