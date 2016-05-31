// var xmlObject;

// if (window.XMLHttpRequest) {
//     xmlObject = new XMLHttpRequest();
//     } else {
//     // code for IE6, IE5
//     xmlObject = new ActiveXObject("Microsoft.XMLHTTP");
// }

var quoteButton = function() {
  var xmlObject;

  if (window.XMLHttpRequest) {
      xmlObject = new XMLHttpRequest();
      } else {
      // code for IE6, IE5
      xmlObject = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlObject.onreadystatechange = function() {
      if (xmlObject.readyState == 4 && xmlObject.status == 200) {
        var response = xmlObject.responseText;
        var object = JSON.parse(response);

        document.getElementById("quote").innerHTML = object[0].content;
        document.getElementById("quote").innerHTML += object[0].title;
      }
    };

  // xmlObject.addEventListener("load", reqListener);
  xmlObject.open("GET", "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1", true);
  xmlObject.send();

};
