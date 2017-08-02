var foundData = false;
var certificates;

$("document").ready(function() {
  $("#main").append("<h3 id='delete'>Loading...</h3>");
  $.get("https://raw.githubusercontent.com/jczhu/recourse-333/final/certificates.json", function(data, status){
        $("#delete").remove();
        foundData = true;
        certificates = JSON.parse(data);
        createMenu(certificates, "#menu");
    });
});

// @ param an array of objects each containing a string parameter titled "name" and a string array parameter titled "courses"
// @ param an array of string containing terms to exclude from the query. If terms[0] = -1, searches entire infoarray
// @ return an array of objects with a string "name" parameter, an integer "hits" parameter, and string array "fulfillments" parameter

function find(infoarray, terms) {
  var alreadyFound = [];
  for(var cert = 0; cert < infoarray.length; cert++) {
    //check if the certificate is withing the query
    var desired = false;
    for(var i = 0; i < terms.length; i++) {
      if(infoarray[cert].name === terms[i]) {
        desired = true;
      }
    }
    
    if(terms[0] === -1 || desired) {
      for(var course = 0; course < infoarray[cert].courses.length; course++) {
      var found = false;
      
      for(var i = 0; i < alreadyFound.length; i++) {
        if(alreadyFound[i].name === infoarray[cert].courses[course]) {
          alreadyFound[i].hits = alreadyFound[i].hits + 1;
          found = true;
          alreadyFound[i].fulfillments.push(infoarray[cert].name);
        }
      }
      
      if(!found) {
        alreadyFound.push({"name":infoarray[cert].courses[course], "hits":1, "fulfillments":[infoarray[cert].name]});
      }
    }
    }
  }
  
  for(var e = 0; e < alreadyFound.length; e++) {
    var max = 0;
    var maxIndex = 0;
    for(var f = e; f < alreadyFound.length; f++) {
      if(alreadyFound[f].hits > max) {
        max = alreadyFound[f].hits;
        maxIndex = f;
      }
    }
    //swap position e with the max
    var temp = alreadyFound[e];
    alreadyFound[e] = alreadyFound[maxIndex];
    alreadyFound[maxIndex] = temp;
  }
  
  return alreadyFound;
}

// @ params two arrays of objects
// @ return a single combined array
function combineArray(array1, array2) {
  var newArr = array1;
  for(var i = 0; i < array2.length; i++) {
    newArr.push(array2[i]);
  }
  
  return newArr;
}

// @ param an array of objects with a string "name" parameter, an integer "hits" parameter, and string array "fulfillments" parameter
// @ param a string indicating destination using jquery syntax

function printArr(infoarray, destination) {
  for(var i = 0; i < infoarray.length; i++) {
    $(destination).append("<p>" + infoarray[i].name + "</p>");
    $(destination).append("<p>" + infoarray[i].hits + "</p>");
    $(destination).append("<p>" + infoarray[i].fulfillments + "</p>");
    $(destination).append("<br><br>");
  }
}

// @ param an array of objects each containing a string parameter titled "name" and a string array parameter titled "courses"
// @ param a string indicating destination using jquery syntax
// creates options to select the listed courses
function createMenu(infoarray, destination) {
  
  for(var i = 0; i < infoarray.length; i++) {
    $(destination).append("<div class='choice'><label><input name='certificate' value = '"+ infoarray[i].name +"' type='checkbox'> " + infoarray[i].name + "</label></div>");
  }
  $(destination).append("<button id='search' onclick='search()'>Search</button>");
}

function search() {
  $("#main").html("");
  printArr(find(certificates, $('input:checkbox:checked').map(function(){return this.value;}).get()), "#main");
}

