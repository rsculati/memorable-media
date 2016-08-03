'use strict';

/**
* @ngdoc function
* @name memorableAppApp.controller:ListCtrl
* @description
* # ListCtrl
* Controller of the memorableAppApp
*/
angular.module('memorableAppApp')
.controller('ListCtrl', function ($scope, $http, srvShareData,$rootScope,$filter,$timeout,$cookieStore) {

  // $cookieStore.put('lastTime',new Date('2016-06-26'));
  // $cookieStore.remove('lastTime');

  $scope.updateNotif = function() {
    console.log("update notif");
    $cookieStore.remove('lastTime');
    $cookieStore.put('lastTime',new Date());
    $('#notif').hide();
    if(typeof session[0] !== 'undefined'){
      $scope.newListDate = session[0][10];
    }
    // $cookieStore.put('lastTime',new Date());
    // console.log($cookieStore.get('lastUpdate'));

  }
  // $cookieStore.put('lastTime',new Date('2016-07-26'));


  var old = $cookieStore.get('lastTime');
  if(!old){
    $cookieStore.put('lastTime',new Date('2016-07-26'));
  }
  $scope.newListDate = [];

  // $http.get('Row1data.json').success (function(data){
  //   var newlist = data;
  //   var oldCookieDate = new Date($cookieStore.get('lastTime'));
  //   console.log(oldCookieDate);
  //   // var oldCookieDate = new Date('2016-07-26')
  //   var newListDate = [];
  //   var cpt = 0 ;
  //   for(var i = 0 ; i < newlist.length; i++){
  //     var dateUpdate = new Date(newlist[i].date)
  //     if(dateUpdate > oldCookieDate && cpt < 6){
  //       $scope.newListDate.push(newlist[i]);
  //       cpt++;
  //     }
  //   }
  //
  //   // console.log($scope.newListDate);
  //
  //   sessionStorage['lastUpdate'] = $scope.newListDate;
  //   console.log($scope.newListDate);
  //   var sessionUpdate = sessionStorage.getItem("lastUpdate");
  //   console.log(sessionUpdate);
  //
  //   // TODO: hide notification if 0
  //   if(newListDate.length == 0){
  //     $('#notif').hide();
  //   }
  //
  // });
  // ------------- NAVIGATION MANAGEMENT ----------------

  // $(window).scroll(function() {
  //    var hT = $('#secondary-filter').offset().top,
  //        hH = $('#secondary-filter').outerHeight(),
  //        wH = $(window).height(),
  //        wS = $(this).scrollTop();
  //    if (wS > (hT+hH)){
  //      if(!$("#secondary-filter").hasClass("fixed-filter")){
  //        $("#secondary-filter").addClass("fixed-filter");
  //      }
  //    } else{
  //      if(!$("#secondary-filter").hasClass("fixed-filter")){
  //        $("#secondary-filter").removeClass("fixed-filter");
  //      }
  //    }
  // });

  $('html, body').animate({
    scrollTop: $("body").offset().top
  }, 0);

  $scope.selectedPrice = "Any price";
  $scope.selectedLocation = "Near Me";
  $scope.selectedHours = "Any time";

  $scope.firstRun = false;

  $scope.carouselData =[
    {"category":"eat","src":"images/brunch-tag.jpg", "text":"Brunch","id":"brunch"},
    {"category":"eat","src":"images/canadian-tag.jpg", "text":"Canadian","id":"canadian"},
    {"category":"eat","src":"images/french-tag.jpg", "text":"French","id":"french"},
    {"category":"eat","src":"images/sweets-tag.jpg", "text":"Sweet","id":"sweet"},
    {"category":"eat","src":"images/vegan-tag.jpg", "text":"Vegetarian","id":"veg"},
    {"category":"eat","src":"images/small-bites.jpg", "text":"Small bites","id":"quick"},
    {"category":"eat","src":"images/healthy-tag.jpg", "text":"Healthy Food","id":"heal"},
    {"category":"eat","src":"images/mexican-tag.jpg", "text":"Mexican","id":"mexican"},
    {"category":"eat","src":"images/asian-tag.jpg", "text":"Asian","id":"asian"},
    {"category":"eat","src":"images/italian-tag.jpg", "text":"Italian","id":"italian"},
    {"category":"eat","src":"images/seafood-tag.jpg", "text":"Seafood","id":"seafood"},
    {"category":"eat","src":"images/mediterranean-tag.jpg", "text":"Mediterranean","id":"mediterranean"},


    {"category":"drink","src":"images/beer-tag.jpg", "text":"Beer","id":"beer"},
    {"category":"drink","src":"images/wine-tag.jpg", "text":"Wine","id":"wine"},
    {"category":"drink","src":"images/terasse-tag.jpg", "text":"Terrace","id":"terrace"},
    {"category":"drink","src":"images/cocktail-tag.jpg", "text":"Cocktail","id":"cocktail"},
    {"category":"drink","src":"images/dance-tag.jpg", "text":"Dance & Party","id":"dance"},
    {"category":"drink","src":"images/healthy-tag.jpg", "text":"Healthy Drink","id":"heal"},
    {"category":"coffee","src":"images/coffee-tag.jpg", "text":"Coffee","id":"cafe"},
    {"category":"coffee","src":"images/tea-tag.jpg", "text":"Tea","id":"tea"},
    {"category":"coffee","src":"images/sweets-tag.jpg", "text":"Sweet","id":"sweet"},
    {"category":"coffee","src":"images/terasse-tag.jpg", "text":"Terrace","id":"terrace"},
    {"category":"shop","src":"images/clothing-tag.jpg", "text":"Clothing","id":"clotheshop"},
    {"category":"shop","src":"images/special-store-tag.jpg", "text":"Special Store","id":"specialshop"},
    {"category":"shop","src":"images/food-drink-shop-tag.jpg", "text":"Food & Drink","id":"foodshop"},
    {"category":"shop","src":"images/coffee-tag.jpg", "text":"Coffee","id":"cafe"},
  ];

  $scope.searchquery = "any";
  $scope.mainCategory = "any";
  // var d = new Date(); // for now
  // $scope.hour = d.getHours();
  // $scope.day = getday(d);

  // ------------- INITIALIZATION ----------------

  // get category depending on the time
  var d = new Date(); // for now
  // $scope.hour = "any";
  $scope.hour = d.getHours();
  $scope.day = getday(d);
  //Session if already exist
  var session = srvShareData.getData();
  $scope.search = getCategorieFromTime(d.getHours());

  if(typeof session[0] !== 'undefined'){
    console.log(session);
    updateList(session[0][0],session[0][1],session[0][2],session[0][3],session[0][4],session[0][9]);
    $scope.selectedPrice = getPriceFormated(session[0][0]);
    $scope.selectedLocation = getFormatedLocation(session[0][2]);
    $scope.selectedHours = getTimeName(session[0][3]);
    $scope.newListDate = session[0][10];

    var val = session[0][9];
    var val2 = session[0][1];
    $scope.filterData = [];
    // notify the carousel about data change
    $rootScope.$broadcast('owlCarousel.changeStart');
    $timeout(function(){
      if (!val) val = '';
      $scope.filterData = $filter('filter')($scope.carouselData, {category: val});
      // console.log($scope.filterData);
      // notify the carousel that data is changed
      $rootScope.$broadcast('owlCarousel.changeEnd');
    });

    mainFilterSelection(val);


  } else {
    $scope.searchquery = "any";

    updateList("any",$scope.searchquery,"you",$scope.hour,$scope.day,$scope.mainCategory);
    $('.main-filter-img').addClass("img-selected");
  }



  // ------------- MAIN FILTERS CATEGORY ----------------
  $scope.refreshData = function(val){
    $scope.filterData = [];
    // notify the carousel about data change
    $rootScope.$broadcast('owlCarousel.changeStart');
    $timeout(function(){
      if (!val) val = '';
      $scope.filterData = $filter('filter')($scope.carouselData, {category: val});
      // console.log($scope.filterData);
      // notify the carousel that data is changed
      $rootScope.$broadcast('owlCarousel.changeEnd');
    });
    // $('#usecase-tag-row').show();

    $scope.searchquery = "";
    mainFilterSelection(val);


    // updateList(price, tag, location, time, day) {
    updateList("any", $scope.searchquery ,"you",$scope.hour,$scope.day,val);
    $scope.mainCategory = val;

    if($scope.firstRun){
      $('html, body').animate({
        scrollTop: $("#main-filter-row").offset().top
      }, 1000);
    }

  }
  // ------------- end ----------------


  // $('.main-filter-img').addClass("img-selected");
  // $('#usecase-tag-row').hide();
  $('#alertInfo').hide();


  // $scope.refreshData('');
  $scope.firstFilter = true;

  // ------------- SECONDARY FILTERS TAGS ----------------

  $scope.filterTag = function (val, type) {
    if($scope.searchquery != val){
      if($scope.firstFilter){
        $('.second-filter-img').addClass("img-unselected");
        $('.'+val).removeClass("img-unselected");
        $('.'+val).addClass("img-selected");
        $scope.firstFilter = false;
      } else {
        $('.second-filter-img').removeClass("img-selected");
        $('.second-filter-img').addClass("img-unselected");
        $('.'+val).removeClass("img-unselected");
        $('.'+val).addClass("img-selected");
      }



      $scope.searchquery = val;
      console.log($scope.mainCategory);

      // updateList("any", tag ,"you",hour,day);
      var session = srvShareData.getData();
      if(typeof session[0] !== 'undefined'){
        updateList(session[0][0], $scope.searchquery ,session[0][2],session[0][3],session[0][4],session[0][9]);
      } else {
        updateList("any", $scope.searchquery,"you",$scope.hour,$scope.day,$scope.mainCategory);
      }

      $('html, body').animate({
        scrollTop: $("#usecase-tag-row").offset().top - 70
      }, 1000);
    } else {
      console.log("same tag");
    }


  }
  // ------------- end ----------------


// ------------- MAIN FILTER SELECTED COLOR ----------------
  function mainFilterSelection(val) {
    switch (val) {
      case "eat":
      $scope.searchquery = "any";
      $scope.mainCategory = "eat";
      $('.main-filter-img').removeClass("img-selected");
      $('.main-filter-img').addClass("img-unselected");
      $('#main-eat').addClass("img-selected");
      $('#usecase-tag-row').show();
      $scope.firstFilter = true;
      $scope.firstRun = true;
      break;
      case "drink":
      $scope.searchquery= "any" ;
      $scope.mainCategory = "drink";
      $('.main-filter-img').removeClass("img-selected");
      $('.main-filter-img').addClass("img-unselected");
      $('#main-drink').addClass("img-selected");
      $('#usecase-tag-row').show();
      $scope.firstFilter = true;
      $scope.firstRun = true;
      break;
      case "coffee":
      $scope.searchquery= "any";
      $scope.mainCategory = "coffee";
      $('.main-filter-img').removeClass("img-selected");
      $('.main-filter-img').addClass("img-unselected");
      $('#main-coffee').addClass("img-selected");
      $('#usecase-tag-row').show();
      $scope.firstFilter = true;
      $scope.firstRun = true;
      break;
      case "shop":
      $scope.searchquery = "any";
      $scope.mainCategory = "shop";
      $('.main-filter-img').removeClass("img-selected");
      $('.main-filter-img').addClass("img-unselected");
      $('#main-shop').addClass("img-selected");
      $('#usecase-tag-row').show();
      $scope.firstFilter = true;
      $scope.firstRun = true;
      break;
    }
  }
  // ------------- MAIN FILTER SELECTED COLOR  END----------------


  // ------------- Analytics Goals ----------------

  $(document).on('click', '.direction-kpi', function(event){

    ga('send', 'event', {
      eventCategory: 'Engagement',
      eventAction: 'Direction click'
    });

    ga('send', 'event', {
      eventCategory: 'Engagement',
      eventAction: 'Direction or Save click'
    });

  });


  // ------------- FILTER USE TAGS ----------------



  // ------------- FILTER PRICE ----------------
  $('.filter-price').click(function(){
    $('.filter-price').removeClass("active");
    $(this).addClass("active");

    var d = new Date(); // for now
    var day = getday(d);
    // var hour = d.getHours();

    $scope.selectedPrice = getPriceFormated($(this).attr("id"));

    var session = srvShareData.getData();
    if(typeof session[0] !== 'undefined'){
      updateList($(this).attr("id"),session[0][1],session[0][2],session[0][3],session[0][4],session[0][9]);
    } else {
      updateList($(this).attr("id"),"any","you",$scope.time,day,$scope.mainCategory);
    }
  });

  // ------------- FILTER TIME ----------------
  $('.filter-time').click(function(){
    $('.filter-time').removeClass("active");
    $(this).addClass("active");

    var hour = $(this).attr("id");
    console.log(hour);
    var d = new Date(); // for now
    var day = getday(d);
    if(hour == "now"){
      hour = d.getHours();
      $scope.time = "now";
    } else {
      $scope.time = hour;
    }

    $scope.selectedHours = getTimeName($(this).attr("id"));

    var session = srvShareData.getData();
    if(typeof session[0] !== 'undefined'){
      updateList(session[0][0],session[0][1],session[0][2],hour,session[0][4],session[0][9]);
    } else {
      updateList(session[0][0],$scope.searchquery,"you",hour,day,$scope.mainCategory);
    }

  });


  // ------------- FILTER LOCATION ----------------
  $('.filter-location').click(function(){
    $('.filter-location').removeClass("active");
    $(this).addClass("active");

    $scope.selectedLocation = getFormatedLocation($(this).attr("id"));

    // var d = new Date(); // for now
    // var day = getday(d);
    // var hour = d.getHours();

    // category, price, tag, location, time, day
    var session = srvShareData.getData();
    if(typeof session[0] !== 'undefined'){
      updateList(session[0][0],session[0][1],$(this).attr("id"),session[0][3],session[0][4],session[0][9]);
    } else {
      updateList("any",$scope.searchquery,$(this).attr("id"),$scope.hour,$scope.day,$scope.mainCategory);
    }
  });


  $scope.getHomeScreenImage = function () {
    var categorieImage = getCategorieFromTime($scope.hour) +".jpg";
    return categorieImage;
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
    var formatedLocation = getFormatedLocation($scope.location);
    if(distance < 1){
      distance = distance * 1000;
      return distance + " m  - from " + formatedLocation;
    } else {
      return distance + " km  - from "  + formatedLocation;
    }
  };

  $scope.getTimeName = function (){
    return getTimeName($scope.time);
  };

  // // search test
  // $scope.search = '';
  // var regex;
  // $scope.$watch('search', function (value) {
  //   regex = new RegExp('\\b' + escapeRegExp(value), 'i');
  // });
  //
  // function escapeRegExp(string){
  //   return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  // }
  //
  // $scope.filterBySearch = function(item) {
  //   if (!$scope.search) return true;
  //   // console.log(item.establishement_name);
  //   return regex.test(item.establishement_name);
  // };


  //intialized imageList
  // var itemList = [];
  var oldItems = [];
  // $scope.$watch('searchTxt', function (val) {
  //   if($scope.items != undefined){
  //     itemList = $scope.items;
  //   }
  //
  //     if(val != undefined){
  //       val = val.toLowerCase();
  //     }
  //
  //     $scope.items = itemList.filter(function (obj) {
  //         var content = obj.establishement_name.toLowerCase() + "" +
  //         obj.establishement_address.toLowerCase() + "" +
  //         obj.establishement_pricerange.toLowerCase() + "" +
  //         obj.influencer1_name.toLowerCase() + "" +
  //         obj.influencer2_name.toLowerCase() + "" +
  //         obj.influencer1_quote_text.toLowerCase() + "" +
  //         obj.influencer2_quote_text.toLowerCase() + "" +
  //         obj.influencer1_publisher_name.toLowerCase() + "" +
  //         obj.influencer2_publisher_name.toLowerCase();
  //
  //         content = content.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  //         val = val.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  //
  //
  //
  //         return content.indexOf(val) != -1;
  //     });
  //
  //     console.log($scope.items.length);
  //     if($scope.items.length === 0 || val === ""){
  //       $scope.items = oldItems;
  //     }
  // })


  // //sort images by something (lets say likes)
  // $scope.sortByPriceRange = function () {
  //     $scope.items.sort(function (a, b) {
  //         return b.establishement_pricerange - a.establishement_pricerange;
  //     });
  //     console.log($scope.items);
  // }


  // function getLocation() {
  //   if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(showPosition);
  //   } else {
  //       x.innerHTML = "Geolocation is not supported by this browser.";
  //   }
  // }
  //
  // function showPosition(position) {
  //   console.log(position.coords.latitude + " : " + position.coords.longitude);
  // }
  //
  // getLocation();

  // var couleur = sessionStorage.getItem("lastUpdate");
  // console.log(couleur[0].establishement_name);


  // ------------- UPDATE LIST ----------------
  // update list of item depending on criteria
  function updateList(price, tag, location, time, day, category) {
    $("#alertInfo").hide();
    // $('#recommendation-feed').fadeOut("slow");
    $scope.search = getSearchFormated(tag);
    $scope.loading = true;
    $scope.loaded = false;
    $scope.location = location;
    // var category = "eat";
    // if(tag != "any"){
    //   category = getMainCategory(tag);
    // } else {
    //   category = getCategorieFromTime(time);
    // }




    console.log("category:" + category + " / "  + "price:" + price + " / " + "tag:" + tag + " / " +
    "location:" + location + " / " + "time:" + time + " / " + "day:" + day);

    $http.get('Row1data.json').success (function(data){
      var obj = data;
      var tagArray = tag; // .split(',');
      var nbtag = tagArray.length;
      var cpt = 0;
      var testCategory;
      var mainObj = [];



      // start notif
      var newlist = data;
      $scope.newListDate = [];
      var oldCookieDate = new Date($cookieStore.get('lastTime'));
      console.log(oldCookieDate);
      // var oldCookieDate = new Date('2016-07-26')
      var newListDate = [];
      // var cpt = 0 ;
      for(var i = 0 ; i < newlist.length; i++){
        var dateUpdate = new Date(newlist[i].date)
        if(dateUpdate > oldCookieDate ){ // && cpt < 6
          $scope.newListDate.push(newlist[i]);
          // cpt++;
        }
      }

      if($scope.newListDate.length == 0){
        $('#notif').hide();
        // TODO: load last 6 recent
      }
      // end notif



      // ------------- USE TAG SCORE ----------------

      // check main category FILTER
      if(category != "any"){
        for(var i = 0 ; i < obj.length; i++){
          var arrayType = obj[i].establishement_type1.split(',');
          testCategory = false;
          for(var y = 0 ; y < arrayType.length; y++){
            if(arrayType[y] == category){
              testCategory = true;
            }
          }
          if(testCategory){
            mainObj.push(obj[i])
          }
        }
        obj = mainObj;
      }


      // FILTER BY TAGS

      var testTag;
      var secondObj = [];
      // tag = 'brunch';
      // tag = tag[0];
      // console.log("tag : " + tag);


      if(tag != "any"){
        for(var i = 0 ; i < obj.length; i++){
          var arrayTagItem = obj[i].usetags.split(',');
          for(var x = 0; x < arrayTagItem.length; x++){
            if(arrayTagItem[x] === tag){
              secondObj.push(obj[i]);
            }
          }
        }
        obj = secondObj;
      }
      // console.log(obj);



      // ------------- PRICE RANGE SCORE ----------------
      // get object with Score of price Range
      if(price != "any"){
        console.log("filter by price");
        var objByPrice = getObjects(obj,'establishement_pricerange', price);
        if(objByPrice.length > 0){
          obj = objByPrice;
        }
        else {
          $("#alertInfo").show();
          setTimeout(function(){
            $("#alertInfo").hide(500).slow();
          }, 5000);
        }
      }
      // console.log(objByPrice);


      // ---------------- TIME SCORE ------------------
      var objWithTime= getObjectsFilterByOpenPlace(obj,time,day)
      var objOpened = objWithTime[0];
      var objClosed = objWithTime[1];
      var enoughOpened = false;

      if(objOpened.length > 1){
        obj = objOpened;
        enoughOpened = true;
      }

      console.log("time2 : " + time);
      console.log("day2 : " + day);

      $scope.items = obj;
      oldItems = obj;


      // ---------------- LOAD MORE ------------------
      // set the default amount of items being displayed
      // $scope.limit= 16;
      // // loadMore function max 6 => infinite scroll
      // $scope.loadMore = function() {
      //   // console.log($scope.limit);
      //   $scope.limit = $scope.limit + 16;
      //   if($scope.limit >= $scope.items.length){
      //     $( "#btnload" ).hide();
      //   }
      // }


      // ---------------- LOCATION SCORE ------------------

      // if(obj.length < 1){
      //   $('#alertInfo').show();
      //   // obj = $scope.items;
      // } else {
      //
      //   $('#alertInfo').hide();
      // }






      if(location == "you"){
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
        // console.log(session);
        if(typeof session[0] !== 'undefined'){
          var difference = timeResearch - session[0][7];
          // console.log(difference + " : difference");
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
            console.log("into geloc");
            var lat1 = position.coords.latitude;
            var lng1 = position.coords.longitude;

            var distances = [];
            // console.log(distance);
            $scope.$apply(function(){
              // $scope.distance = distance;
              $scope.lat = lats;
              $scope.lng = lng1;
              for (var i = 0 ; i < longs.length; i++) {
                obj[i].distance = getDistanceBetween(lat1, lng1, $scope.lats[i], $scope.longs[i], 'K');
                // console.log(obj[i].establishement_name + " : " + distances[i]);
              }

              // sort by distance
              obj.sort(function(a, b) {
                return parseFloat(a.distance) - parseFloat(b.distance);
              });

              if(enoughOpened){
                for (var i = 0 ; i < objClosed.length; i++){
                  objClosed[i].distance = getDistanceBetween(lat1, lng1, objClosed[i].establishement_lat, objClosed[i].establishement_long, 'K');
                  obj.push(objClosed[i]);
                }
              }


              $scope.items = obj;
              oldItems = obj;

              // console.log(timeResearch);
              // console.log(srvShareData.getData());
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
              $scope.dataToShare.push(category);
              console.log($scope.dataToShare);
              //notif
              $scope.dataToShare.push($scope.newListDate);

              // console.log($scope.items);
              srvShareData.addData($scope.dataToShare);

            }); // scope.apply()

          }); // navigator.geolocation

        } else { // gps == false
          // $scope.lats = session[0][5];
          // $scope.longs = session[0][6];
          var lat1 = session[0][5];
          var lng1 = session[0][6];

          var distances = [];
          // console.log(distance);
          // $scope.$apply(function(){
          // $scope.distance = distance;
          for (var i = 0 ; i < obj.length; i++) {
            obj[i].distance = getDistanceBetween(obj[i].establishement_lat, obj[i].establishement_long, session[0][5], session[0][6], 'K');
          }

          // sort by distance
          obj.sort(function(a, b) {
            return parseFloat(a.distance) - parseFloat(b.distance);
          });

          if(enoughOpened){
            for (var i = 0 ; i < objClosed.length; i++){
              objClosed[i].distance = getDistanceBetween(lat1, lng1, objClosed[i].establishement_lat, objClosed[i].establishement_long, 'K');
              obj.push(objClosed[i]);
            }
          }

          $scope.items = obj;
          oldItems = obj;

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
          $scope.dataToShare.push(category);
          //notif
          $scope.dataToShare.push($scope.newListDate);

          // console.log($scope.items);
          srvShareData.addData($scope.dataToShare);
        }

        // console.log(obj);
      }

      else {

        var geodata = getGeoData(location);
        // $scope.lats = geodata[0];
        // $scope.longs = geodata[0];

        var distances = [];
        // console.log(distance);
        // $scope.$apply(function(){
        // $scope.distance = distance;
        for (var i = 0 ; i < obj.length; i++) {
          obj[i].distance = getDistanceBetween(obj[i].establishement_lat, obj[i].establishement_long, geodata[0],  geodata[1], 'K');
        }

        // sort by distance
        obj.sort(function(a, b) {
          return parseFloat(a.distance) - parseFloat(b.distance);
        });

        if(enoughOpened){
          for (var i = 0 ; i < objClosed.length; i++){
            objClosed[i].distance = getDistanceBetween(geodata[0],  geodata[1], objClosed[i].establishement_lat, objClosed[i].establishement_long, 'K');
            obj.push(objClosed[i]);
          }
        }

         $scope.items = obj;
         oldItems = obj;


        // // calculate score distance
        // for (var i = 0 ; i < obj.length; i++) {
        //   if(tag == "any"){
        //     obj[i].scoreDistance = 25 - ((25 / obj.length) * i * 2);
        //   } else {
        //     obj[i].scoreDistance = 25 - ((25 / obj.length) * i);
        //   }
        //   // console.log(obj[i].establishement_name + " : " + obj[i].distance);
        // }
        //
        // //calculate total score
        // for (var i = 0 ; i < obj.length; i++) {
        //   obj[i].totalScore = (obj[i].scoreTags * 5) + obj[i].scoreTime  + obj[i].scoreDistance  +  obj[i].scorePrice;
        // }
        //
        // // sort by total score
        // obj.sort(function(a, b) {
        //   return parseFloat(b.totalScore) - parseFloat(a.totalScore);
        // });

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
          // console.log(difference);
          if(difference < 0.06){
            gps = true;
            // console.log(difference);
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
        $scope.dataToShare.push(category);
        //notif
        $scope.dataToShare.push($scope.newListDate);

        // console.log($scope.items);
        srvShareData.addData($scope.dataToShare);

        // }); // scope.apply()
      }
    }
  );
  $('#recommendation-feed').fadeOut("fast").fadeIn("slow");
}

$('#cta-hero').click(function(){
  $('html, body').animate({
    scrollTop: $( $.attr(this, 'href') ).offset().top
  }, 1000);
  return false;
});

}).directive("owlCarousel", function($timeout) {
  return {
    restrict: 'E',
    transclude: false,
    link: function (scope) {
      scope.initCarousel = function(element) {
        // provide any default options you want
        var defaultOptions = {
        };
        var customOptions = scope.$eval($(element).attr('data-options'));
        // combine the two options objects
        for(var key in customOptions) {
          defaultOptions[key] = customOptions[key];
        }
        // init carousel
        $(element).owlCarousel(defaultOptions);

        // Event to remove the carousel on data change start
        scope.$on('owlCarousel.changeStart', function(data) {
          // console.log('owlCarousel.destroy');
          var data = $(element).data('owlCarousel');
          if (data) data.destroy();
        });
        // Event to create the carousel back when data change is completed
        scope.$on('owlCarousel.changeEnd', function(data) {
          $timeout(function() {
            // console.log('owlCarousel.create ');
            $(element).owlCarousel(defaultOptions);
          });
        });
      };

    }
  };
})
.directive('owlCarouselItem', [function() {
  return {
    restrict: 'A',
    transclude: false,
    link: function(scope, element) {
      // wait for the last item in the ng-repeat then call init
      if(scope.$last) {
        scope.initCarousel(element.parent());
      }
    }
  };
}]);

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
