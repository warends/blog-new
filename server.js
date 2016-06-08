var express = require('express'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');


var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

if(env === 'development') {
  mongoose.connect('mongodb://localhost/pluralsight');
} else {
  mongoose.connect('mongodb://willadmin:wills817@ds011278.mlab.com:11278/wills-test');
}

var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback(){
      console.log('App DB Connected');
    });

var messageSchema = new mongoose.Schema({
  message: String
});

var Message = mongoose.model('Message', messageSchema);
var mongoMessage;
Message.findOne().exec(function(err, response) {
  mongoMessage = response.message;
});


app.get('/partials/:partialPath', function(req, res){
    res.render('partials/' + req.params.partialPath);
});

app.get('*', function(req, res){
  res.render('index', {
    mongoMessage : mongoMessage
  });
});

var port = process.env.PORT || 8080;
app.listen(port);

console.log('Server is running on port ' + port);
