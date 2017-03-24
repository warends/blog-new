describe('Posts Controller', () => {

  var $controller, PostController, scope, PostService;

  var postList = 'What is your process?';

  beforeEach(angular.mock.module('post.list'));
  beforeEach(angular.mock.module('post.service'));

  beforeEach(inject((_$rootScope_, _$controller_, _PostService_) => {
    scope = _$rootScope_.$new();
    $controller = _$controller_;
    PostService = _PostService_;

    spyOn(PostService, 'query').and.callFake(function() {
      return postList;
    });

    PostController = $controller('PostListController', {
      $scope: scope,
      Posts: PostService
    });

  }));

  it('should be defined', () => {
    expect(PostController).toBeDefined();
  });

  it('should initialize with a call to PostService.query()', function() {
    expect(PostService.query).toHaveBeenCalled();
    //expect(PostController.$scope.posts[0].title).toEqual(postList);
  });



});
