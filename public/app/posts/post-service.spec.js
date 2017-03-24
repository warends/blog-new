describe('Posts Service', () => {

  var Post;

  beforeEach(angular.mock.module('post.service'));

  beforeEach(inject(function(_PostService_) {
    Post = _PostService_;
  }));

  it('should exist', () => {
    expect(Post).toBeDefined();
  });

  describe('.query()', () => {
     it('should exist', () => {
       expect(Post.query).toBeDefined();
     });
 });

 describe('get Posts', () => {
    it('should exist', () => {
      expect(Post.get).toBeDefined();
    });

  });

});
