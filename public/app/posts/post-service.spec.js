describe('Posts Service', () => {

  var Post, $q, $httpBackend;

  var APIroute = 'http://localhost:8080/api/posts/';

  var MockResponse = {
    '_id': 123,
    'author': 'Will Arends',
    'body': '',
    'categories' : [],
    'comments': [],
    'exceprt': '',
    'gists': [],
    'postedDate': '2016-08-25T06:00:00.000Z',
    'slug': 'what-is-your-process',
    'title': 'What is your process?'
  };

  beforeEach(angular.mock.module('post.service'));

  beforeEach(inject(function(_PostService_, _$q_, _$httpBackend_) {
    PostService = _PostService_;
    $q = _$q_;
    $httpBackend = _$httpBackend_;
  }));

  it('should exist', () => {
    expect(PostService).toBeDefined();
  });

  describe('.query()', () => {
     it('should exist', () => {
       expect(PostService.query).toBeDefined();
     });
 });

 describe('get()', () => {
    it('should exist', () => {
      expect(PostService.get).toBeDefined();
    });
  });

  describe('getPost()', () => {
      var result;

      beforeEach(() => {
        result = {};
        spyOn(PostService, 'getPost').and.callThrough();
      });

      it('should return a post when called with a valid slug', () => {
        var slug = 'what-is-your-process';
        $httpBackend.whenGET('/api/posts/what-is-your-process').respond(MockResponse);

        expect(PostService.getPost).not.toHaveBeenCalled();
        expect(result).toEqual({});

        PostService.getPost(slug).then((res) => {
          result = res;
        });

        $httpBackend.flush();

        expect(PostService.getPost).toHaveBeenCalledWith(slug);
        expect(result.title).toEqual('What is your process?');



      });
  });

});
