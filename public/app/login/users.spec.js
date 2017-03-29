describe('Users Factory', () => {

  var User;

  beforeEach(angular.mock.module('users.service'));

  beforeEach(inject(function(_UserService_) {
    User = _UserService_;
  }));

  it('should exist', () => {
    expect(User).toBeDefined();
  });

  describe('.query()', () => {
     it('should exist', () => {
       expect(User.query).toBeDefined();
     });
 });

 // describe('get users', () => {
 //
 //    it('should exist', () => {
 //      expect(User.get).toBeDefined();
 //    });
 //
 //    it('should return false if the user is not set up as admin', () => {
 //      var user = new User();
 //      console.log(user);
 //      user.roles = ['not admin'];
 //      expect(user.isAdmin()).to.be.falsey;
 //    });
 //
 //    it('should return true if the roles array has an admin entry', () => {
 //      var user = new User();
 //      user.roles= ['admin'];
 //      expect(user.isAdmin()).to.be.true;
 //    });
 //
 //  });

});
