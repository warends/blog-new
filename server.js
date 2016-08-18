var express = require('express');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';


var app = express();

var config = require('./app/config/config')[env];

require('./app/config/express')(app,config);

require('./app/config/mongoose')(config);

require('./app/config/passport')();

require('./app/config/routes')(app);

app.listen(config.port);
console.log('Server is running on port ' + config.port);
