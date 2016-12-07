var mongoose = require('mongoose'),
    encryption = require('../utilities/encryption');

var userSchema = new mongoose.Schema ({
  firstName: {type:String, required:'{PATH} is required'},
  lastName: {type:String, required:'{PATH} is required'},
  username: {
    type:String,
    required:'{PATH} is required',
    unique: true
  },
  salt: String,
  hashed_pwd: String,
  roles: [String]
});

userSchema.methods = {
  authenticate: function(passwordToMatch){
    return encryption.hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
  },
  hasRole: function(role) {
    return this.roles.indexOf(role) > -1;
  }
}

var User = mongoose.model('User', userSchema);

function createDefaultUser(){
  User.find({}).exec(function(err, results){
    if(results.length === 0){
      var salt, hash;
      salt = encryption.createSalt();
      hash = encryption.hashPwd(salt, 'wills817');

      User.create({
        firstName: 'Will',
        lastName: 'Arends',
        username: 'willarends',
        salt: salt,
        hashed_pwd: hash,
        roles: ['admin']
      });
    }
  });

}

module.exports = {
  User: User,
  createDefaultUser: createDefaultUser
}
