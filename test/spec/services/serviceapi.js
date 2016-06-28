'use strict';

describe('Service: serviceAPI', function () {

  // load the service's module
  beforeEach(module('memorableAppApp'));

  // instantiate service
  var serviceAPI;
  beforeEach(inject(function (_serviceAPI_) {
    serviceAPI = _serviceAPI_;
  }));

  it('should do something', function () {
    expect(!!serviceAPI).toBe(true);
  });

});
