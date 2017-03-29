process.env.NODE_ENV = 'test';

let mongoose = require('mongoose'),
    User = require('../app/models/User').User,
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../server'),
    auth = require('../app/config/auth'),
    encryption = require('../app/utilities/encryption'),
    should = chai.should(),
    passportStub = require('passport-stub');

chai.use(chaiHttp);
passportStub.install(server);

//parent block
describe('Users', () => {

  beforeEach((done) => {
      User.remove({}, (err) => {
        let user = { firstName: 'Test', lastName: 'User', username: 'testuser', password: 'testpass', roles: ['admin'] }
        new User(user).save()
          .then((testUser) => {
              user = testUser;
              done();
          });
      });

  });

  //GET route
  describe('/GET users', () => {
    it('should NOT get users without admin role', (done) => {
      chai.request(server)
      .get('/api/users')
      .end((err, res) => {
        res.should.have.status(403);
        res.should.have.property('ok').eql(false);
        done();
      });
    });
  });

  // //GET a user
  // describe('/GET user', () => {
  //   it('should GET a list of users with admin auth', (done) => {
  //     let user = new User ({
  //       firstName: 'Test',
  //       lastName: 'User',
  //       username: 'testuser',
  //       password: 'testpass',
  //       roles: ['admin']
  //     });
  //     user.save((err, user) => {
  //       chai.request(server)
  //         .get('/api/users')
  //         .send(user)
  //         .end((err, res) => {
  //             //console.log(res);
  //             res.should.have.status(200);
  //             // res.body.should.be.a('object');
  //             // res.body.should.have.property('firstName');
  //             // res.body.roles.should.be.a('array');
  //           done();
  //         });
  //     });
  //   });
  // });

  //SAVE a user
  describe('/POST user', () => {
    it('should create a new user', (done) => {
      // let user = {
      //   firstName: 'Test',
      //   lastName: 'User',
      //   username: 'testuser',
      //   password: 'testpass',
      //   roles: ['admin']
      // }
      chai.request(server)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('firstName');
            res.body.roles.should.be.a('array');
          done();
        });
      });
    });













}); //end parent block
