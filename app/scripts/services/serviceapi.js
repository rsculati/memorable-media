'use strict';

/**
* @ngdoc service
* @name memorableAppApp.serviceAPI
* @description
* # serviceAPI
* Factory in the memorableAppApp.
*/
angular.module('memorableAppApp')
.factory('serviceAPI', function ($http) {
  // Service logic
  // ...
  return{
    save: function(place,token){
      return $http.post("http://localhost:8080/api/favorite?place="+page+"&token="+token);
    }
  }


});
