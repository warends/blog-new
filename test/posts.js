process.env.NODE_ENV = 'test';

let mongoose = require('mongoose'),
    Post = require('../app/models/Post').Post,
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../server'),
    should = chai.should();

chai.use(chaiHttp);

//parent block
describe('Posts', () => {

    beforeEach((done) => { //empty the database
        Post.remove({}, (err) => {
           done();
        });
    });

  //GET ROUTE
  describe('/GET post', () => {
      it('should GET all the posts', (done) => {
        chai.request(server)
            .get('/api/posts')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });

  //SAVE a post
  describe('/POST post', () => {
    it('should create a new post', (done) => {
      let post = {
        title: 'Test Post',
        slug: 'test-post',
        categories: ['test'],
        excerpt : "This is a test post",
        body: "This is a test post body",
        author: 'Will Arends',
        postedDate: Date.now()
      }
      chai.request(server)
        .post('/api/posts/' + post.slug)
        .send(post)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.a.property('title');
          res.body.should.have.a.property('slug');
          res.body.should.have.a.property('excerpt');
          res.body.should.have.a.property('body');
          done();
        });
      });
  });

  //GET a post
  describe('/GET/:slug post', () => {
    it('should get a post with a slug', (done) => {
      let post = new Post({
        title: 'Test Post',
        slug: 'test-post',
        categories: ['test'],
        excerpt : "This is a test post",
        body: "This is a test post body",
        author: 'Will Arends',
        postedDate: Date.now()
      });
      post.save((err, post) => {
        chai.request(server)
          .get('/api/posts/' + post.slug)
          .send(post)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('slug');
            res.body.should.have.property('excerpt');
            res.body.should.have.property('body');
            res.body.should.have.property('_id').eql(post.id);
            done();
          });
        });
      });
    });

    //PUT a post
    describe('/PUT post', ()=>{
      it('should update a post with given slug', (done) => {
        let post = new Post({
          title: 'Test Post',
          slug: 'test-post',
          categories: ['test'],
          excerpt : "This is a test post",
          body: "This is a test post body",
          author: 'Will Arends',
          postedDate: Date.now()
        });
        post.save((err, post) => {
          chai.request(server)
            .put('/api/posts/' + post.slug)
            .send({
              title: 'Test Post Edited',
              slug: 'test-post',
              categories: ['test'],
              excerpt : "This is a test post",
              body: "This is a test post body",
              author: 'Will Arends',
              postedDate: Date.now()
            })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('title').eql('Test Post Edited');
              done();
            });
        });
      });
    });

    //DELETE a post
    describe('/DELETE post', () => {
      it('should delete a post give the slug', (done) => {
        let post = new Post({
          title: 'Test Post',
          slug: 'test-post',
          categories: ['test'],
          excerpt : "This is a test post",
          body: "This is a test post body",
          author: 'Will Arends',
          postedDate: Date.now()
        });
        post.save((err, post) => {
          chai.request(server)
            .delete('/api/post/' + post.slug)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.should.have.property('ok').eql(true);
              done();
            });
        });
      });
    });


}); //end parent block
