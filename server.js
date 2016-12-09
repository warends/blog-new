var express = require('express'),
    env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    routes = require('./app/routes');

var app = express();

var config = require('./app/config/config')[env];

require('./app/config/express')(app,config);

require('./app/config/mongoose')(config);

require('./app/config/passport')();

//require('./app/config/routes')(app);

app.use('/', routes);

app.listen(config.port);
console.log('Server is running on port ' + config.port);
