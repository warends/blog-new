var path = require('path'),
    rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development : {
      rootPath: rootPath,
      db: 'mongodb://willadmin:wills817@willarends-dev-shard-00-00.bqw4e.mongodb.net:27017,willarends-dev-shard-00-01.bqw4e.mongodb.net:27017,willarends-dev-shard-00-02.bqw4e.mongodb.net:27017/wills-test?ssl=true&replicaSet=atlas-3mf502-shard-0&authSource=admin&retryWrites=true&w=majority',
      port: process.env.PORT || 8080
  },
  test: {
      rootPath: rootPath,
      db: 'mongodb://localhost/WADtest',
      port: process.env.PORT || 8080
  },
  production: {
      rootPath: rootPath,
      db: 'mongodb://willadmin:wills817@willarends-dev-shard-00-00.bqw4e.mongodb.net:27017,willarends-dev-shard-00-01.bqw4e.mongodb.net:27017,willarends-dev-shard-00-02.bqw4e.mongodb.net:27017/wills-test?ssl=true&replicaSet=atlas-3mf502-shard-0&authSource=admin&retryWrites=true&w=majority',
      port: process.env.PORT || 80
  }

}
