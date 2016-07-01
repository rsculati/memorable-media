/* jshint ignore:start */
'use strict';

/**
 * @ngdoc function
 * @name memorableAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the memorableAppApp
 */
angular.module('memorableAppApp')
  .controller('MainCtrl', function ($scope, $http, $routeParams, $window, $sce, srvShareData) {

    $(document).ready(function(){
      $(this).scrollTop(0);
    });

    var haveSession = false;
    var session = srvShareData.getData();
    if(typeof session[0] !== 'undefined'){
      $scope.location = session[0][2];
      $scope.time = session[0][3];
      var sessionTab = session[0][8];
      var related = [];
      var cpt = 0 ;
      for(var i = 0; i < sessionTab.length; i++){
        if(sessionTab[i].establishement_name_id != $routeParams.param1 && cpt < 3){
          related.push(sessionTab[i]);
          cpt++;
        }
      }
      $scope.session = related;
      haveSession = true
      console.log("session :"  + session);
    } else {
      haveSession = false;
      console.log("no session variable");
    }

    $scope.getDayFormated = function (day) {
      if(day == "-"){
        return "closed";
      }
      // "11.5-15,17.5-23",
      //
      var result = "";
      var temp_result = "";
      if (typeof day != typeof undefined) {
        var arraySchedule = day.split(',');
        for(var i = 0 ; i < arraySchedule.length; i++) {

          var array = arraySchedule[i].split('-');
          for(var y = 0 ; y < array.length; y++) {
            var numberArray = array[y].split('.');

            var decimal = numberArray[0]
            var float = "00";
            if (typeof numberArray[1] != typeof undefined) {
              float = numberArray[1];
              float = "0." + float;
              float = parseFloat(float);
              float = float * 60;
              console.log(float);
            }

            if(decimal < 10){
              decimal = "0"+decimal;
            }
            var temp = decimal + ":" + float + "-";
            temp_result = temp_result + temp;
          }
          temp_result = temp_result.substring(0,temp_result.length-1)
          // console.log(temp_result);
          temp_result = temp_result + ", ";
        }

      }
      var length = temp_result.length;
      return temp_result.substring(0, length-2) ;
    }

    $scope.getPriceWithFormated = function (price) {
      return getPriceFormated(price);
    }

    // ------------- DISPLAY DISTANCE ----------------
    $scope.getDistance = function (distance, item){
      if(isNaN(item.distance)){
        var centerlat = 45.501724;
        var centerlong = -73.567285;
        var distanceCenter = getDistanceBetween(centerlat, centerlong, item.establishement_lat, item.establishement_long, 'K');
        if(distanceCenter < 1){
          distanceCenter = distanceCenter * 1000;
          return distanceCenter + " m from city center";
        } else {
          return distanceCenter + " km from city center";
        }
      }
      if(distance < 1){
        distance = distance * 1000;
        return distance + " m  - from " + $scope.location;
      } else {
        return distance + " km  - from "  + $scope.location;
      }
    };

    $scope.getTimeName = function (){
      return getTimeName($scope.time);
    };


    $http.get('Row1data.json').success (function(data){
      // console.log(data);

      // TODO: if param1 = numero id déjà présent, on modifie la variable
      // param1 avec l'unique ID correspondant. (temporaire)

      var param1 = $routeParams.param1;
      // 
      // if(param1 == 14) {
      //   param1 = "mtl-fantome";
      // }
      // if(param1 == 33) {
      //   param1 = "mtl-jatoba";
      // }
      // if(param1 == 2) {
      //   param1 = "mtl-olivegourmando";
      // }
      // if(param1 == 39) {
      //   param1 = "mtl-squaredominion";
      // }
      // if(param1 == 53) {
      //   param1 = "mtl-unicorn";
      // }
      // if(param1 == 0) {
      //   param1 = "mtl-piedcochn";
      // }
      // if(param1 == 44) {
      //   param1 = "mtl-salondaome";
      // }
      // if(param1 == 50) {
      //   param1 = "mtl-m0851";
      // }
      // if(param1 == 16) {
      //   param1 = "mtl-lab";
      // }
      // if(param1 == 41) {
      //   param1 = "mtl-cafeplume";
      // }
      // if(param1 == 31) {
      //   param1 = "mtl-distillerie";
      // }
      // if(param1 == 12) {
      //   param1 = "mtl-patricepatissier";
      // }
      // if(param1 == 13) {
      //   param1 = "mtl-viceversa";
      // }
      // if(param1 == 29) {
      //   param1 = "mtl-dispatch";
      // }
      // if(param1 == 36) {
      //   param1 = "mtl-buvettesimone";
      // }
      // if(param1 == 46) {
      //   param1 = "mtl-kitsune";
      // }
      // if(param1 == 26) {
      //   param1 = "mtl-pullman";
      // }
      // if(param1 == 18) {
      //   param1 = "mtl-pikoloexpressobar";
      // }
      // if(param1 == 32) {
      //   param1 = "mtl-sparrow";
      // }
      // if(param1 == 46) {
      //   param1 = "mtl-kitsune";
      // }

      // console.log(getObjects(data ,'establishement_name_id',param1));


      if(getObjects(data ,'establishement_name_id',param1) === undefined){
        //console.log(data[param1]);
        $window.location.href = '/index.html';
      }
      var tab = getObjects(data ,'establishement_name_id',param1);

      var item = tab[0];

      // ------------- RELATED POIS ----------------
      if(!haveSession){
        var relatedArray = [];
        var related = getObjects(data ,'establishement_type1',item.establishement_type1);

        var arr = []
          while(arr.length < 5){
            var randomnumber=Math.ceil(Math.random()* related.length)
            var found=false;
            for(var i=0;i<arr.length;i++){
          	if(arr[i]==randomnumber){found=true;break}
            }
            if(!found)arr[arr.length]=randomnumber;
          }

        var cpt = 0 ;
        for(var i = 0; i < 3; i++){
          if(related[arr[i]].establishement_name_id != $routeParams.param1 && cpt < 3){
            relatedArray.push(related[arr[i]]);
            console.log(related[arr[i]]);
            cpt++;
          }
        }
        $scope.session = relatedArray;
      }


      $scope.item = item;
        $scope.trustSrc = function(id) {
        return $sce.trustAsResourceUrl("https://instagram.com/p/"+id+"/embed?hidecaption=true");
      }
      // $scope.instagramUrl1.trustAsResourceUrl("http://instagram.com/p/"+$scope.item.establishement_instagram1+"/embed");

      // console.log(getObjects(data ,'establishement_type','Coffee')); //retrieve all POI by establishement_type
      // console.log(getValues(data,'establishement_type')); //retrieve all the establishement_type
      // console.log(getKeys(data,'Coffee')); //retrieve the type of Data for a specific key (coffee in this example)
      $scope.urlImage = "images/"+ item.establishement_name_id + '.jpg'; //"images/"+ data[param1].establishement_id + '.jpg';
      // console.log(item  .establishement_name_id);
      var elements = ["colored"];
      // var hover = ["hover-colored"];
      setElementColorsImages("images/"+ $scope.item.establishement_name_id + '.jpg',elements,0, "color");
      // setElementColorsImages("images/"+ $scope.item.establishement_id + '.jpg',hover,0, "a:hover");

    });



    // function getEstimatesForUserLocation(latitude,longitude, poiLatitude, poiLongitude) {
//   // Uber API Constants
//   var uberClientId = "WAuipm4kL9AQwUA1h8B2qx7Vw-6mr3_O";
//   var uberServerToken = "5ZW7zcsFBVnc4lVHDuedFo30EtatGMCUVg7CsJ7p";
//
//   $.ajax({
//     url: "https://api.uber.com/v1/estimates/price",
//     headers: {
//         Authorization: "Token " + uberServerToken
//     },
//     data: {
//         start_latitude: latitude,
//         start_longitude: longitude,
//         end_latitude: poiLatitude,
//         end_longitude: poiLongitude
//     },
//     success: function(result) {
//         sortUberByPrice(result);
//     }
//   });
// }
//
// function sortUberByPrice(result){
//   var data = result["prices"];
//   if (typeof data != typeof undefined) {
//     // Sort Uber products by time to the user's location
//     data.sort(function(t0, t1) {
//       return t0.duration - t1.duration;
//     });
//
//     // Update the Uber button with the shortest time
//     var shortest = data[0];
//     // console.log("time " + Math.ceil(shortest.duration / 60.0) + " MIN");
//     // console.log("price : " + shortest.estimate);
//     if (typeof shortest != typeof undefined) {
//       console.log("Updating time estimate...");
//        $("#time").html(shortest.estimate);
//     }
//   }
// }




});

/* jshint ignore:end */
