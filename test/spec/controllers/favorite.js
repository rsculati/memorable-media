'use strict';

describe('Controller: FavoriteCtrl', function () {

  // load the controller's module
  beforeEach(module('memorableAppApp'));

  var FavoriteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FavoriteCtrl = $controller('FavoriteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FavoriteCtrl.awesomeThings.length).toBe(3);
  });
});
