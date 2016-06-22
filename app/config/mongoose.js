var mongoose = require('mongoose'),
    crypto = require('crypto');

module.exports = function(config){

  mongoose.connect(config.db);

  var db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error...'));
      db.once('open', function callback(){
        console.log('App DB Connected');
      });

  var userSchema = mongoose.Schema ({
    firstName: String,
    lastName: String,
    userName: String,
    salt: String,
    hashed_pwd: String,
    roles: [String]
  });

  userSchema.methods = {
    authenticate: function(passwordToMatch){
      return hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
    }
  }

  var User = mongoose.model('User', userSchema);

  User.find({}).exec(function(err, results){
    if(results.length === 0){
      var salt, hash;
      salt = createSalt();
      hash = hashPwd(salt, 'admin');

      User.create({
        firstName: 'Will',
        lastName: 'Arends',
        userName: 'willarends',
        salt: salt,
        hashed_pwd: hash,
        roles: ['admin']
      });
    }
  });

  function createSalt() {
    return crypto.randomBytes(128).toString('base64');
  }

  function hashPwd(salt, pwd){
    var hmac = crypto.createHmac('sha1', salt);
    hmac.setEncoding('hex');
    hmac.write(pwd);
    hmac.end();
    return hmac.read();
  }

}
