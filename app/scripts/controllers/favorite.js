'use strict';

/**
* @ngdoc function
* @name memorableAppApp.controller:FavoriteCtrl
* @description
* # FavoriteCtrl
* Controller of the memorableAppApp
*/
angular.module('memorableAppApp')
.controller('FavoriteCtrl', function ($scope, $http, $cookies) {


  // var token = getParameterByName('token');
  // console.log(token);




  var favorite = getParameterByName('favorite');
  var token = getParameterByName('token');
  var name = getParameterByName('name');
  console.log(favorite);
  console.log(token);
  console.log(name);

  if(token != null){
    var user = {
      name : name,
      token : token,
      favorite : favorite
    };
    console.log(user);
    // Put cookie
    $cookies.put('myUser',JSON.stringify(user));

  }

  // Get cookie
  var myUser = $cookies.getObject('myUser');
  console.log(myUser);

  $scope.user = myUser;



  // Removing a cookie
  // $cookies.remove('myUserToken');

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

});
