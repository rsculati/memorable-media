'use strict';

/**
 * @ngdoc function
 * @name memorableAppApp.controller:ListCtrl
 * @description
 * # ListCtrl
 * Controller of the memorableAppApp
 */
angular.module('memorableAppApp')
  .controller('ListCtrl', function ($scope, $http, srvShareData) {



    // ------------- NAVIGATION MANAGEMENT ----------------
    // nav filter management
    $(window).scroll(function() {
       var hT = $('#cta-hero').offset().top,
           hH = $('#cta-hero').outerHeight(),
           wH = $(window).height(),
           wS = $(this).scrollTop();
       if (wS > (hT+hH)){
           $(".filter-navbar").addClass("visible-filter");
          /* $(".fa-filter").addClass("visible-filter");
           $(".fa-filter").removeClass("invisible-filter");
           $(".icon-bar").addClass("invisible-filter");
           $(".icon-bar").removeClass("visible-filter");*/
           $(".icon-filter").addClass("visible-filter");
           $(".icon-filter").removeClass("invisible-filter");
           $(".icon-menu").addClass("invisible-filter");
           $(".icon-menu").removeClass("visible-filter");
       } else{
         $(".filter-navbar").removeClass("visible-filter");
         /*$(".icon-bar").addClass("visible-filter");
         $(".icon-bar").removeClass("invisible-filter");
         $(".fa-filter").removeClass("visible-filter");
         $(".fa-filter").addClass("invisible-filter");*/
         $(".icon-menu").addClass("visible-filter");
         $(".icon-menu").removeClass("invisible-filter");
         $(".icon-filter").removeClass("visible-filter");
         $(".icon-filter").addClass("invisible-filter");
       }
    });

    //$(".filter").click().addClass("selected");
    $('.filter').click(function(){
      if($(this).hasClass("selected")){
        ($(this).removeClass("selected"));
      }else{
        $(this).addClass("selected");
      }
    });

    // ------------- FILTER USE TAGS ----------------
    $('.filter-todo').click(function(){
      if($(this).hasClass("active")){
        ($(this).removeClass("active"));
      }else{
        $(this).addClass("active");
      }

      $.searchquery = "";
      $(".filter-todo.active").each(function() {
        $.searchquery+=$(this).attr("id")+",";
      });
      if($.searchquery == ""){
        $.searchquery = "any";
      }

      var session = srvShareData.getData();
      if(typeof session[0] !== 'undefined'){
        updateList(session[0][0], $.searchquery,session[0][2],session[0][3],session[0][4]);
      } else {
        updateList("any", $.searchquery,"around-me",$scope.hour,$scope.day);
      }

    });

    // ------------- FILTER PRICE ----------------
    $('.filter-price').click(function(){
      $('.filter-price').removeClass("active");
      $(this).addClass("active");

      var d = new Date(); // for now
      var day = getday(d);
      var hour = d.getHours();

      var session = srvShareData.getData();
      if(typeof session[0] !== 'undefined'){
        updateList($(this).attr("id"),session[0][1],session[0][2],session[0][3],session[0][4]);
      } else {
        updateList($(this).attr("id"),"any","around-me",hour,day);
      }
    });

    // ------------- FILTER TIME ----------------
    $('.filter-time').click(function(){
      $('.filter-time').removeClass("active");
      $(this).addClass("active");

      var hour = $(this).attr("id");
      var d = new Date(); // for now
      var day = getday(d);
      if(hour == "now"){
        hour = d.getHours();
      }

      var session = srvShareData.getData();
      if(typeof session[0] !== 'undefined'){
        updateList(session[0][0],session[0][1],session[0][2],hour,session[0][4]);
      } else {
        updateList(session[0][0],"any","around-me",hour,day);
      }
    });


    // ------------- FILTER LOCATION ----------------
    $('.filter-location').click(function(){
      $('.filter-location').removeClass("active");
      $(this).addClass("active");

      var d = new Date(); // for now
      var day = getday(d);
      var hour = d.getHours();

      // category, price, tag, location, time, day
      var session = srvShareData.getData();
      if(typeof session[0] !== 'undefined'){
        updateList(session[0][0],session[0][1],$(this).attr("id"),session[0][3],session[0][4]);
      } else {
        updateList("any","any",$(this).attr("id"),hour,day);
      }
    });


    // ------------- VALIDATE BUTTON ----------------
    // validate button - thing to do query
    $("#filter-category-validation-btn").click(function() {
    $.searchquery = "";
    $(".selected").each(function() {
      console.log($(this));
    //  console.log(index + " : " + value);
      //console.log(value[index].attr("id"));
      $.searchquery+=$(this).attr("id")+",";
    });

    $.searchquery = $.searchquery.substring(0,$.searchquery.length-1);
    console.log($.searchquery);
    /*updateList($(this).text());*/
    var d = new Date(); // for now
    var hour = d.getHours();
    var day = getday(d);
      updateList("$$", $.searchquery,"around-me",hour,day);
    $('html, body').animate({
        scrollTop: $( $.attr(this, 'href') ).delay(1000).offset().top
    }, 1000);
    });


    // ------------- MODALS MANAGEMENT ----------------
    $(".modal-fullscreen").on('show.bs.modal', function () {
      setTimeout( function() {
        $(".modal-backdrop").addClass("modal-backdrop-fullscreen");
      }, 0);
    });
    $(".modal-fullscreen").on('hidden.bs.modal', function () {
      $(".modal-backdrop").addClass("modal-backdrop-fullscreen");
    });

  // ------------- INITIALIZATION ----------------

  // get category depending on the time
  var d = new Date(); // for now
  $scope.hour = d.getHours();
  $scope.day = getday(d);
  //Session if already exist
  var session = srvShareData.getData();

  if(typeof session[0] !== 'undefined'){
    updateList(session[0][0],session[0][1],session[0][2],session[0][3],session[0][4]);

    var tagArray = session[0][1].split(',');
    for(var i = 0 ; i < tagArray.length; i++){
      $("#"+tagArray[i]).addClass("active");
    }
    // $("#"+session[0][1]).addClass("active");
    console.log(session[0][2]);
    $("#"+session[0][2]).addClass("active");
    // $("#"+session[0][1]).addClass("active");
    // price, tag, location, time, day

  } else {
    updateList("any","any","around-me",$scope.hour,$scope.day);
    // $("#any").addClass("active");
    $("#around-me").addClass("active");
  }


    $scope.getHomeScreenImage = function () {
      var categorieImage = getCategorieFromTime($scope.hour) +".jpg";
      return categorieImage;
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
        return distance + " m";
      } else {
        return distance + " km";
      }
    };


    // ------------- UPDATE LIST ----------------
    // update list of item depending on criteria
    function updateList(price, tag, location, time, day) {
      $scope.loading = true;
      $scope.loaded = false;
      var category;
      if(tag != "any"){
        category = getMainCategory(tag);
      } else {
        category = getCategorieFromTime(time);
      }

      console.log(category + " : " + price + " : " + tag + " : " + location + " : " + time + " : " + day);

      $http.get('Row1data.json').success (function(data){
        var obj = data;
        var tagArray = tag.split(',');
        var nbtag = tagArray.length;
        var cpt = 0;
        var testCategory = false;

        // TODO: add COFFEE to tag => min majuscule..


        // ------------- USE TAG SCORE ----------------
        // loop into array of obj
        for(var x = 0; x < obj.length; x++){
          // check if any
          if(tag != "any"){
            if(tag === "eat," || tag === "drink," || tag === "shop,"){

              // // check for multiple category
              var arrayType = obj[x].establishement_type1.split(',');
              for(var a = 0 ; a < arrayType.length; a++){
                  if(arrayType[a] == category){
                    testCategory = true;
                  }
              }

              console.log(category + " : " + testCategory + " : " + obj[x].establishement_name);
              if(testCategory){
                obj[x].scoreTags = 25 * 3;
              } else {
                obj[x].scoreTags =  25 / 5;
              }
              testCategory = false;
            }
            else {
              // split usetag into array
              var array = obj[x].usetags.split(',');
              // loop into tag array to calculate score of usetag
              for(var i = 0 ; i < tagArray.length; i++) {
                for(var y = 0 ; y < array.length; y++) {
                  if(tagArray[i] == array[y]){
                    cpt++;
                  }
                }
              }
              // check for multiple category
              var arrayType = obj[x].establishement_type1.split(',');
              // console.log(arrayType);
              for(var a = 0 ; a < arrayType.length; a++){
                  if(arrayType[a] == category){
                    testCategory = true;
                  }
              }
              if(testCategory){
                obj[x].scoreTags = (cpt / nbtag) * 25;
              } else {
                obj[x].scoreTags = ((cpt / nbtag) * 25)/5;
              }
              cpt = 0;
              testCategory = false;
            }
          } // if "any" choice
          else {
            // check for multiple category
            var arrayType = obj[x].establishement_type1.split(',');
            for(var a = 0 ; a < arrayType.length; a++){
                if(arrayType[a] == category){
                  testCategory = true;
                }
            }

            console.log(category + " : " + testCategory + " : " + obj[x].establishement_name);
            if(testCategory){
              obj[x].scoreTags = 25 * 3;
            } else {
              obj[x].scoreTags =  25 / 5;
            }
            testCategory = false;
            // console.log(obj[x].scoreTags + " : " + obj[x].establishement_name);
          }
        }

        // ------------- PRICE RANGE SCORE ----------------
        // get object with Score of price Range
        var objByPrice = getObjectWithPriceRangeScore(obj,price);
        obj = objByPrice;



        // ---------------- TIME SCORE ------------------
        // get object with Score of schedule
          var objByTime = getObjectsWithHourScore(obj,time,day);
          obj = objByTime;
          // for(var b = 0 ; b < obj.length; b++) {
          //   console.log(obj[b].timeAlert + " : " + obj[b].establishement_name );
          // }

        // ---------------- LOAD MORE ------------------
        // set the default amount of items being displayed
        $scope.limit= 6;
        // loadMore function max 6 => infinite scroll
        $scope.loadMore = function() {
        console.log($scope.limit);
        $scope.limit = $scope.limit + 6;
        if($scope.limit >= $scope.items.length){
          $( "#btnload" ).hide();
          }
        }


        // ---------------- LOCATION SCORE ------------------

        $scope.items = obj;


        if(location == "around-me"){
          var lats = getValues(obj ,'establishement_lat');
          var longs = getValues(obj ,'establishement_long');
          $scope.lats = lats;
          $scope.longs = longs;

          var d = new Date(); // for now
          // var day = getday(d);
          var hour = d.getHours();
          var n = d.getMinutes();
          var timeResearch = hour + (n / 60);
          var gps = false;
          var session = srvShareData.getData();
          console.log(session);
          if(typeof session[0] !== 'undefined'){
            var difference = timeResearch - session[0][7];
            console.log(difference + " : difference");
            if(difference < 0.06){
              gps = true;
            } else {
              gps = false;
            }
          }

            if(gps == false){
              console.log("no old gps records");
              // if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                  var lat1 = position.coords.latitude;
                  var lng1 = position.coords.longitude;

                  var distances = [];
                  // console.log(distance);
                  $scope.$apply(function(){
                    // $scope.distance = distance;
                    $scope.lat = lats;
                    $scope.lng = lng1;
                    for (var i = 0 ; i < longs.length; i++) {
                      distances[i]  = getDistanceBetween(lat1, lng1, $scope.lats[i], $scope.longs[i], 'K');
                      obj[i].distance = distances[i];
                      // console.log(obj[i].establishement_name + " : " + distances[i]);
                    }

                    // sort by distance
                    obj.sort(function(a, b) {
                        return parseFloat(a.distance) - parseFloat(b.distance);
                    });


                    // calculate score distance
                    for (var i = 0 ; i < obj.length; i++) {
                      if(tag == "any"){
                        obj[i].scoreDistance = 25 - ((25 / obj.length) * i * 2);
                      } else {
                        obj[i].scoreDistance = 25 - ((25 / obj.length) * i);
                      }
                        // console.log(obj[i].establishement_name + " : " + obj[i].distance);
                    }

                    //calculate total score
                    for (var i = 0 ; i < obj.length; i++) {
                        obj[i].totalScore = (obj[i].scoreTags * 5) + obj[i].scoreTime  + obj[i].scoreDistance  +  obj[i].scorePrice;
                    }

                    // sort by total score
                    obj.sort(function(a, b) {
                        return parseFloat(b.totalScore) - parseFloat(a.totalScore);
                    });


                    console.log(timeResearch);
                    console.log(srvShareData.getData());
                    $scope.loading = false;
                    $scope.loaded = true;

                    sessionStorage.clear();
                    $scope.dataToShare = [];
                    $scope.dataToShare.push(price);
                    $scope.dataToShare.push(tag);
                    $scope.dataToShare.push(location);
                    $scope.dataToShare.push(time);
                    $scope.dataToShare.push(day);
                    $scope.dataToShare.push(lat1);
                    $scope.dataToShare.push(lng1);
                    $scope.dataToShare.push(timeResearch);

                    var multipleobj = [];
                    multipleobj.push(obj[0]);
                    multipleobj.push(obj[1]);
                    multipleobj.push(obj[2]);
                    multipleobj.push(obj[3]);
                    $scope.dataToShare.push(multipleobj);

                    // console.log($scope.items);
                    srvShareData.addData($scope.dataToShare);

                  }); // scope.apply()

                }); // navigator.geolocation

            } else { // gps == false
              $scope.lats = session[0][5];
              $scope.longs = session[0][6];
              var lat1 = session[0][5];
              var lng1 = session[0][6];

              var distances = [];
              // console.log(distance);
              // $scope.$apply(function(){
                // $scope.distance = distance;
                for (var i = 0 ; i < obj.length; i++) {
                  distances[i]  = getDistanceBetween(obj[i].establishement_lat, obj[i].establishement_long, session[0][5], session[0][6], 'K');
                  obj[i].distance = distances[i];
                }

                // sort by distance
                obj.sort(function(a, b) {
                    return parseFloat(a.distance) - parseFloat(b.distance);
                });


                // calculate score distance
                for (var i = 0 ; i < obj.length; i++) {
                  if(tag == "any"){
                    obj[i].scoreDistance = 25 - ((25 / obj.length) * i * 2);
                  } else {
                    obj[i].scoreDistance = 25 - ((25 / obj.length) * i);
                  }
                    // console.log(obj[i].establishement_name + " : " + obj[i].distance);
                }

                //calculate total score
                for (var i = 0 ; i < obj.length; i++) {
                    obj[i].totalScore = (obj[i].scoreTags * 5) + obj[i].scoreTime  + obj[i].scoreDistance  +  obj[i].scorePrice;
                }

                // sort by total score
                obj.sort(function(a, b) {
                    return parseFloat(b.totalScore) - parseFloat(a.totalScore);
                });

                $scope.loading = false;
                $scope.loaded = true;

                sessionStorage.clear();
                $scope.dataToShare = [];
                $scope.dataToShare.push(price);
                $scope.dataToShare.push(tag);
                $scope.dataToShare.push(location);
                $scope.dataToShare.push(time);
                $scope.dataToShare.push(day);
                $scope.dataToShare.push(lat1);
                $scope.dataToShare.push(lng1);
                $scope.dataToShare.push(timeResearch);
                var multipleobj = [];
                multipleobj.push(obj[0]);
                multipleobj.push(obj[1]);
                multipleobj.push(obj[2]);
                multipleobj.push(obj[3]);
                $scope.dataToShare.push(multipleobj);

                // console.log($scope.items);
                srvShareData.addData($scope.dataToShare);
            }

            // console.log(obj);
          }

          else {
            var geodata = getGeoData(location);
            $scope.lats = geodata[0];
            $scope.longs = geodata[0];

            var distances = [];
            // console.log(distance);
            // $scope.$apply(function(){
              // $scope.distance = distance;
              for (var i = 0 ; i < obj.length; i++) {
                distances[i]  = getDistanceBetween(obj[i].establishement_lat, obj[i].establishement_long, geodata[0],  geodata[1], 'K');
                obj[i].distance = distances[i];
              }

              // sort by distance
              obj.sort(function(a, b) {
                  return parseFloat(a.distance) - parseFloat(b.distance);
              });


              // calculate score distance
              for (var i = 0 ; i < obj.length; i++) {
                if(tag == "any"){
                  obj[i].scoreDistance = 25 - ((25 / obj.length) * i * 2);
                } else {
                  obj[i].scoreDistance = 25 - ((25 / obj.length) * i);
                }
                  // console.log(obj[i].establishement_name + " : " + obj[i].distance);
              }

              //calculate total score
              for (var i = 0 ; i < obj.length; i++) {
                  obj[i].totalScore = (obj[i].scoreTags * 5) + obj[i].scoreTime  + obj[i].scoreDistance  +  obj[i].scorePrice;
              }

              // sort by total score
              obj.sort(function(a, b) {
                  return parseFloat(b.totalScore) - parseFloat(a.totalScore);
              });

              $scope.loading = false;
              $scope.loaded = true;

              var d = new Date(); // for now
              // var day = getday(d);
              var hour = d.getHours();
              var n = d.getMinutes();
              var timeResearch = hour + (n / 60);
              console.log(timeResearch);
              var gps = false;
              var session = srvShareData.getData();
              if(typeof session[0] !== 'undefined'){
                var difference = timeResearch - session[0][7];
                console.log(difference);
                if(difference < 0.06){
                  gps = true;
                  console.log(difference);
                }
              }

              sessionStorage.clear();
              $scope.dataToShare = [];
              $scope.dataToShare.push(price);
              $scope.dataToShare.push(tag);
              $scope.dataToShare.push(location);
              $scope.dataToShare.push(time);
              $scope.dataToShare.push(day);

              if(gps == true){
                $scope.dataToShare.push(session[0][5]);
                $scope.dataToShare.push(session[0][6]);
              } else {
                $scope.dataToShare.push(24);
                $scope.dataToShare.push(24);
              }


              $scope.dataToShare.push(timeResearch);
              var multipleobj = [];
              multipleobj.push(obj[0]);
              multipleobj.push(obj[1]);
              multipleobj.push(obj[2]);
              multipleobj.push(obj[3]);
              $scope.dataToShare.push(multipleobj);

              // console.log($scope.items);
              srvShareData.addData($scope.dataToShare);

            // }); // scope.apply()
          }
      }
    );
  }

    $('#cta-hero').click(function(){
    $('html, body').animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 1000);
    return false;
  });

});

angular.module('memorableAppApp')
  .service('srvShareData', function($window) {
        var KEY = 'App.SelectedValue';

        var addData = function(newObj) {
            var mydata = $window.sessionStorage.getItem(KEY);
            if (mydata) {
                mydata = JSON.parse(mydata);
            } else {
                mydata = [];
            }
            mydata.push(newObj);
            $window.sessionStorage.setItem(KEY, JSON.stringify(mydata));
        };

        var getData = function(){
            var mydata = $window.sessionStorage.getItem(KEY);
            if (mydata) {
                mydata = JSON.parse(mydata);
            }
            return mydata || [];
        };

        return {
            addData: addData,
            getData: getData
        };
    });
