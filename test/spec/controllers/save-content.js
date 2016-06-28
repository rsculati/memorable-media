'use strict';

describe('Controller: SaveContentCtrl', function () {

  // load the controller's module
  beforeEach(module('memorableAppApp'));

  var SaveContentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SaveContentCtrl = $controller('SaveContentCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SaveContentCtrl.awesomeThings.length).toBe(3);
  });
});
