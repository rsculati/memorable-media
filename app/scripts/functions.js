/* jshint ignore:start */

//return corresponding categorie text
function getCategorieText(categorie){
  var text = "";
  switch (categorie) {
    case "Eat":
      text = "EAT";
      break;
    case "Drink":
      text = "DRINK";
      break;
    case "Shop":
      text = "SHOP";
      break;
    case "Coffee":
      text = "HAVE A COFFEE";
      break;
    default:
      obj = data;
      text = "EAT";
  }
  return text;
}

//return section depending on the hour
function getCategorieFromTime(hour) {

  if(hour >= 0 && hour <= 4 ){
    return "drink";
  }
  if(hour >= 5 && hour <= 10 ){
    return "coffee";
  }
  if(hour >= 11 && hour <= 13 ){
    return "eat";
  }
  if(hour >= 14 && hour <= 16 ){
    return "coffee";
  }
  if(hour >= 17 && hour <= 18 ){
    return "drink";
  }
  if(hour >= 19 && hour <= 20 ){
    return "eat";
  }
  if(hour >= 21 && hour <= 24 ){
    return "drink";
  }
}

// return day of week
function getday(d){
  var weekday = new Array(7);
  weekday[0]=  "sunday";
  weekday[1] = "monday";
  weekday[2] = "tuesday";
  weekday[3] = "wednesday";
  weekday[4] = "thursday";
  weekday[5] = "friday";
  weekday[6] = "saturday";

  var n = weekday[d.getDay()];

  return n;
}

//return distance between two coordinates
function getDistanceBetween(lat1, lon1, lat2, lon2, unit) {

  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="N") { dist = dist * 0.8684 }
  return dist.toFixed(2);
}

//set the color of a html element based on the colors's analysis of an image
function setElementColorsImages(url, elements, color, style){
  var img = document.createElement('img');
  img.setAttribute('src', url)
  img.addEventListener('load', function() {
      var vibrant = new Vibrant(img);
      var swatches = vibrant.swatches()
      var objects = [];
      for (var swatch in swatches) {
          if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
              console.log(swatch, swatches[swatch].getHex())
              objects.push(swatches[swatch].getHex());

          }
      }
      for (index = 0; index < elements.length; ++index) {
          // document.getElementById("test").style.color = objects[color];
          var collect = document.getElementsByClassName(elements[index]);
          console.log(collect);
          changeColor(collect, objects[color], style);
      }

      // console.log(objects);
      //  Results into: * Vibrant #7a4426  * Muted #7b9eae * DarkVibrant #348945 * DarkMuted #141414 * LightVibrant #f3ccb4
      //  document.getElementById('blockquote').style.color = '#7a4426';
  });
}

function changeColor(coll, color, style){

    for(var i=0, len=coll.length; i<len; i++)
    {
        coll[i].style[style] = color;
    }
}

//return an array of objects according to key, value, or key and value matching
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else
        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
        } else if (obj[i] == val && key == ''){
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}

//return an array of values that match on a certain key
function getValues(obj, key) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
            objects.push(obj[i]);
        }
    }
    return objects;
}

//return an array of keys that match on a certain value
function getKeys(obj, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getKeys(obj[i], val));
        } else if (obj[i] == val) {
            objects.push(i);
        }
    }
    return objects;
}

//return an array of items match on a certain tag
function getObjectsFromTags(obj, val) {
  // var objects = [];
  var tags = ["Banana", "Orange", "Apple", "Cocktail"];
  if(tags.indexOf(val) != -1) {
  }
  // for (var i in obj) {
  //   if(obj[i].establishement_tags}.indexOf(val) != -1){
  //      objects.push(i);
  //   }
  // }
  return obj;
  // if(objects.length < 1){

  // TODO: if no result indication

  //   return obj;
  // } else {
  //     return objects;
  // }
}

// return an array with the score of the time opened or not
function getObjectsWithHourScore(obj,time,day) {
  // TODO: check day
  // TODO: check
  time = parseInt(time);

  for (var i = 0; i < obj.length; i++) {
    if(time == "any"){
        obj[i].scoreTime = 25;
    } else {
      var open = false;
      var hour = obj[i][day];

      // console.log(hour);
      if(hour){
        var schedule = hour.split(',');

        // console.log(schedule + " : " + obj[i].establishement_name);
        for(var y = 0; y < schedule.length; y++){
          schedule[y] = schedule[y].split('-');

          if(parseInt(schedule[y][1]) < parseInt(schedule[y][0])){
            schedule[y][1] = parseInt(schedule[y][1]) + 24;
          }

          if(schedule[y][0] != ""){
            if(time > schedule[y][0] && time < schedule[y][1]){
              open = true;
              // obj[i].timeAlert = "Open";
              if((schedule[y][1] - time) < 1){
                obj[i].timeAlert = "Closing soon";
              }
            }
            console.log(obj[i].establishement_name + " : " + schedule[y][0] + "-"+schedule[y][1] + " : "  + time + " : " + open);
          }
        }
      }

      // console.log(time + " : " +  schedule + " : " + obj[i].establishement_name);
      if(open === true){
        obj[i].scoreTime = 25;
        // obj[i].timeAlert = "Open";
        if(obj[i].timeAlert === "Closing soon"){
          obj[i].timeAlert = "Closing soon";
        } else {
          obj[i].timeAlert = "Open";
        }
      } else {
          obj[i].scoreTime = 0;
          obj[i].timeAlert = "Closed";
      }
    }
  }
  // console.log(obj);
  return obj;
}

// retrieve an array of items match to a certain criteria
function getObjectsFromCriteria(obj, criteria, value) {
  var objects = [];
  for (var i in obj) {
    if(obj[i][criteria] == value){
       objects.push(obj[i]);
    }
  }
  return objects;
}

// get search formated
function getSearchFormated(search){
  var formated = "";
  var tagArray = search.split(',');
  var arrEat = [];
  var arrDrink = [];
  var arrShop = [];

  var test = "";
  switch (search) {
    case "eat,":
      test = "Eat";
      break;
    case "drink,":
      test = "Drink";
      break;
    case "shop,":
      test = "Shop";
      break;
  }
  if(test != "")
    return test;

  for(var i = 0 ; i < tagArray.length; i++){
    switch (tagArray[i]) {
      case "brunch":
        arrEat.push(" Brunch");
        break;
      case "sweet":
        arrEat.push(" something Sweet");
        break;
      case "quick":
        arrEat.push(' Quickly');
        break;
      case "veg":
        arrEat.push(" Vegan");
        break;
      case "heal":
        arrEat.push(" Healthy");
        break;
      case "cafe":
        arrDrink.push(" Coffee");
        break;
      case "tea":
        arrDrink.push(" Tea");
        break;
      case "cocktail":
        arrDrink.push(" Cocktail");
        break;
      case "wine":
        arrDrink.push(" Wine");
        break;
      case "beer":
        arrDrink.push(" Beer");
        break;
      case "terrace":
        formated = formated + ", on a terrace";
        break;
      case "dance":
        formated = formated + ", go dancing";
        break;
      case "special":
        formated = formated + ", try something Special";
        break;
      case "clotheshop":
        arrShop.push(" Clothes shop");
        break;
      case "foodshop":
        arrShop.push(" Food shop");
        break;
      case "specialshop":
        arrShop.push(" Special shop");
        break;
    }
  }
  var str = "";
  if(arrEat.length > 0){
    str = " Eat ";
    for(var i = 0 ; i < arrEat.length; i++){
      str = str + arrEat[i] + ",";
    }
  }
  if(arrDrink.length > 0){
    str = str + " Drink ";
    for(var i = 0 ; i < arrDrink.length; i++){
      str = str + arrDrink[i] + ",";
    }
  }
  if(arrShop.length > 0){
    str = str + " Shop in a ";
    for(var i = 0 ; i < arrShop.length; i++){
      str = str + arrShop[i] + ",";
    }
  }

  formated = str + formated;

    return formated.substring(0, formated.length);
}

//return price formated
function getPriceFormated(price) {

  switch (price) {
    case "$":
      price = "$ - Inexpensive";
      break;
    case "$$":
      price = "$$ - Moderate";
      break;
    case "$$$":
      price = "$$$ - Pricey";
      break;
    case "$$$$":
      price = "$$$$ - Ultra High-End";
      break;
  }
  return price;
}

getPriceFormated
// return an array with the score of the price range
function getObjectWithPriceRangeScore(obj, price){
  for (var i = 0; i < obj.length; i++) {
    if(price == "any"){
      obj[i].scorePrice = 25;
    } else {
      switch (obj[i]["establishement_pricerange"]) {
        case "$":
          obj[i].scorePrice = 25 - (5 * (Math.abs(price.length - 1)));
          break;
        case "$$":
          obj[i].scorePrice = 25 - (5 * (Math.abs(price.length - 2)));
          break;
        case "$$$":
          obj[i].scorePrice = 25 - (5 * (Math.abs(price.length - 3)));
          break;
        case "$$$$":
          obj[i].scorePrice = 25 - (5 * (Math.abs(price.length - 4)));
          break;
        default:
        obj[i].scorePrice = 25;
      }
    }
  }
  return obj;
}

//return an array of items matching a certain neighborhood
function getObjectsFromNeighborhood(obj, location) {
  var objects = getObjectsFromCriteria(obj,"establishement_neighborhood", location);
  if(objects.length < 1){
    return obj;

    // TODO: if no result indication

  } else {
    return objects;
  }
}

// return an array of geodata depending on neighborhood
function getGeoData(location){

  var geodata = [];
  switch (location) {
    case "mile-end":
      geodata[0] = 45.524103;
      geodata[1] = -73.598418;
      break;
    case "plateau":
      geodata[0] = 45.526003;
      geodata[1] = -73.584241;
      break;
    case "downtown":
      geodata[0] = 45.504772;
      geodata[1] = -73.567533;
      break;
    case "old-port":
      geodata[0] = 45.504784;
      geodata[1] = -73.555950;
      break;
    case "village":
      geodata[0] = 45.516106;
      geodata[1] = -73.560320;
      break;
    case "westmount":
      geodata[0] = 45.478944;
      geodata[1] = -73.611009;
      break;
    case "little-italy":
      geodata[0] = 45.531895;
      geodata[1] = -73.611164;
      break;
    case "sud-ouest":
      geodata[0] = 45.477771;
      geodata[1] = -73.576040;
      break;
    default:
  }
  return geodata;
}

// return formated location named
function getFormatedLocation(location){
  // console.log(location);
  var formated = "";
  switch (location) {
    case "mile-end":
      formated = "Mile-End";
      break;
    case "plateau":
      formated = "Plateau";
      break;
    case "downtown":
      formated = "Downtown";
      break;
    case "old-port":
      formated = "Old Port";
      break;
    case "village":
      formated = "Quartier des Spectacles";
      break;
    case "westmount":
      formated = "Westmount & NDG";
      break;
    case "little-italy":
      formated = "Little Italy";
      break;
    case "sud-ouest":
      formated = "Sud-Ouest";
      break;
    case "you":
      formated = "you";
    break;
  }
  return formated;
}

// return a main category depending on use tag
function getMainCategory(tag) {

  var tagArray = tag.split(',');
  var c_eat = 0 , c_coffee = 0 , c_drink = 0 , c_shop = 0 ;
  for(var i = 0 ; i < tagArray.length; i++) {
    switch (tagArray[i]) {
      case "brunch":
        c_eat++;
        break;
      case "sweet":
        c_eat++;
        break;
      case "quick":
        c_eat++;
        break;
      case "veg":
        c_eat++;
        break;
      case "heal":
        c_eat++;
        c_drink++;
        break;
      case "cafe":
        c_coffee++;
        break;
      case "tea":
        c_coffee++;
        break;
      case "cocktail":
        c_drink++;
        break;
      case "wine":
        c_drink++;
        break;
      case "beer":
        c_drink++;
        break;
      case "terrace":
        c_drink++;
        c_coffee++;
        c_eat++;
        break;
      case "dance":
        c_drink++;
        break;
      case "special":
        c_drink++;
        c_shop++;
        c_eat++;
        break;
      case "clotheshop":
        c_shop++;
        break;
      case "foodshop":
        c_shop++;
        break;
      case "specialshop":
        c_shop++;
        break;
      case "eat":
        c_eat++;
        break;
      case "drink":
        c_drink++;
        c_coffee++;
        break;
      case "shop":
        c_shop++;
        break;
    }
  }
  var scores = [[],[],[],[]];
  scores[0][0] = c_drink;
  scores[0][1] = "drink";
  scores[1][0] = c_eat;
  scores[1][1] = "eat";
  scores[2][0] = c_coffee;
  scores[2][1] = "coffee";
  scores[3][0] = c_shop;
  scores[3][1] = "shop";

  // sort by total score
  scores.sort(function(a, b){return b[0]-a[0]});

  return scores[0][1];
}

// get main Tag if any eat or drink
function getMaintag(tag){
  if(tag === "eat,"){
    tag = "any";
    return tag;
  }else {
    return tag;
  }
}

// return time name for
function getTimeName(time){
  var formated = "";
  switch (time) {
    case "now":
      formated = "now";
      break;
    case "9.5":
      formated = "in the morning";
      break;
    case "12.5":
      formated = "at Lunch";
      break;
    case "15":
      formated = "in the Afternoon";
      break;
    case "17.5":
      formated = "for a 5 à 7";
      break;
    case "19":
      formated = "for Dinner";
      break;
    case "23":
      formated = "Late Night";
      break;
    default:
      formated = "now";
  }

  return formated;

  }

/* jshint ignore:end */
