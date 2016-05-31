// TODO: load a bunch (like 10) quotes at the beginning and then cycle through them so there is
// less delay every time the button is pressed to load a new quote. Could also use this to
// discriminate those quotes whose size is too large to display correctly. The network hit
// for loading this data is pretty small.

var quoteButton = function() {
  var xmlObject;
  var colourObject;

  if (window.XMLHttpRequest) {
      xmlObject = new XMLHttpRequest();
      colourObject = new XMLHttpRequest();
      } else {
      // code for IE6, IE5
      xmlObject = new ActiveXObject("Microsoft.XMLHTTP");
      colourObject = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlObject.onreadystatechange = function() {
    if (xmlObject.readyState == 4 && xmlObject.status == 200) {
      var response = xmlObject.responseText;
      var object = JSON.parse(response);

      document.getElementById("quote").innerHTML = object[0].content;
      document.getElementById("quote").innerHTML += "<p id=\"author\">" + object[0].title + "</p>";
    }
  };

  colourObject.onreadystatechange = function() {
    if (colourObject.readyState == 4 && colourObject.status == 200) {
      var response = colourObject.responseText;
      // var object = JSON.parse(response);
      var xmlDoc = new DOMParser().parseFromString(response,'text/html');

      hexColour = "#" + xmlDoc.getElementsByTagName("hex")[0].innerText;
      setColour(hexColour);
      // var red = xmlDoc.getElementsByTagName("red")[0].innerText;
      // var green = xmlDoc.getElementsByTagName("green")[0].innerText;
      // var blue = xmlDoc.getElementsByTagName("blue")[0].innerText;
    }
  };

  // TODO: Do you really need two seperate XMLHttpRequest objects for this?
  // I think yes, as with one you wouldn't be able to check both as getting 200 status
  //
  // The line " + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime()" bypasses the cache as described
  // in the Mozilla XMLHttpRequest docs
  var quoteUrl = "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";
  var colourUrl = "http://www.colourlovers.com/api/colors/random";

  xmlObject.open("GET", quoteUrl + ((/\?/).test(quoteUrl) ? "&" : "?") + (new Date()).getTime(), true);
  xmlObject.send();

  colourObject.open("GET", colourUrl + ((/\?/).test(colourUrl) ? "&" : "?") + (new Date()).getTime(), true);
  colourObject.send();

};

function setColour(hexColour) {
  console.log(hexColour);
  document.getElementById('main').style.background = hexColour;
};
