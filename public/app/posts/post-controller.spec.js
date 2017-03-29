describe('Posts Controller', () => {

  var $controller, PostController, scope, CachedPostService, stateParams;

  var postList = 'What is your process?';

  beforeEach(angular.mock.module('post.detail'));
  beforeEach(angular.mock.module('post.service'));
  beforeEach(angular.mock.module('post.cache'));
  beforeEach(angular.mock.module('common.meta'));

  beforeEach(inject((_$rootScope_, _$controller_, _CachedPostService_) => {
    scope = _$rootScope_.$new();
    $controller = _$controller_;
    CachedPostService = _CachedPostService_;
    stateParams = {slug: 'what-is-your-process'};

    spyOn(CachedPostService, 'query').and.callThrough();

    PostController = $controller('PostDetailController', {
      $scope: scope,
      Posts: CachedPostService,
      $stateParams: stateParams
    });

  }));

  it('should be defined and call services', function() {
    expect($controller).toBeDefined();
    expect(CachedPostService.query).toHaveBeenCalled();
  });



});
