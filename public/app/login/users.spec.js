describe('Users Factory', () => {

  var Users;

  beforeEach(angular.mock.module('users.service'));

  beforeEach(inject((_Users_) => {
    Users = _Users_;
  }));

  it('should exist', () => {
    expect(Users).toBeDefined();
  });
});
