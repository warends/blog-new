describe('mvUser', function() {

  beforeEach(module('willsBlog'));

  describe('isAdmin', function(){
      it('should return false if the user is not set up as admin', inject(function(mvUser) {

        var user = new mvUser();
        user.roles= ['not admin'];
        expect(user.isAdmin()).to.be.falsey;

      }));

      it('should return true if the roles array has an admin entry', inject(function(mvUser) {

        var user = new mvUser();
        user.roles= ['admin'];
        expect(user.isAdmin()).to.be.true;

      }));

    });


});
