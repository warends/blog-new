var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    engine = require('ejs-locals'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport');

module.exports = function(app, config){

  app.engine('ejs', engine);
  app.set('views', config.rootPath + '/app/views');
  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(session({
    secret: 'passwords n suff',
    resave: false,
    saveUninitialized: false
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(config.rootPath + '/public'));

}
