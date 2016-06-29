var quoteUrl = "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";
var colourUrl = "http://www.colourlovers.com/api/colors/random";
var quoteArray = [];
var flag = 0;

// Onload do this...
window.onload = function() {
  loadQuoteData();
  loadColourData();
};

// Set behaviour for when the quote button is clicked
document.getElementById("refresh").addEventListener("click", function() {
  displayQuote();
});

// Display the quote by grabbing the pre-loaded quote from the quote array if it exists.
// This array acts as a queue data structure. If the next quote is undefined, then set
// the quote area to display "loading...", and call loadQuoteData(), which will grab a new
// quote and update the display.
function displayQuote() {
  var currentQuote = quoteArray.shift();

  if (currentQuote !== undefined) {
    document.getElementById("quote").innerHTML = currentQuote[0].content;
    document.getElementById("quote").innerHTML += "<p id=\"author\">" + currentQuote[0].title + "</p>";
    var tweetString = currentQuote[0].content.replace(/<(?:.|\n)*?>/gm, '') + " - " + currentQuote[0].title;
    updateTweet(tweetString);
    // Only want to set new colour upon changing quote.
    loadColourData();
  } else {
    document.getElementById("quote").innerHTML = "Quote Loading...";
  }

  loadQuoteData();
};

// Set the background colour
function setColour(hexColour) {
  document.getElementById('main').style.background = hexColour;
};

// Make a call to get a new quote
function loadQuoteData() {
  var quoteXmlObject;

  if (window.XMLHttpRequest) {
      quoteXmlObject = new XMLHttpRequest();
      } else {
      // code for IE6, IE5
      quoteXmlObject = new ActiveXObject("Microsoft.XMLHTTP");
  }

  quoteXmlObject.onreadystatechange = function() {
    if (quoteXmlObject.readyState == 4 && quoteXmlObject.status == 200) {
      var response = quoteXmlObject.responseText;
      var object = JSON.parse(response);

      // workaround for displaying proper quote length, since the api doesn't offer
      // length options for free version. This is innefficient, and it is impossible
      // to predict how many calls to the quote API will be made.
      if (object[0].content.length < 150) {
        quoteArray.push(object);
      } else {
        loadQuoteData();
      }

      if (flag === 0 || document.getElementById("quote").innerHTML === "Quote Loading...")  {
        flag = 1;
        displayQuote();
      }
    }
  };

  quoteXmlObject.open("GET", quoteUrl + ((/\?/).test(quoteUrl) ? "&" : "?") + (new Date()).getTime(), true);
  quoteXmlObject.send();
};

// Load a new colour value. Unfortunately the API has a lot of unavoidable overhead,
// when all we really want is a simple hex value.
function loadColourData() {
    var colourXmlObject;

    if (window.XMLHttpRequest) {
        colourXmlObject = new XMLHttpRequest();
        } else {
        // code for IE6, IE5
        colourXmlObject = new ActiveXObject("Microsoft.XMLHTTP");
    }

    colourXmlObject.onreadystatechange = function() {
      if (colourXmlObject.readyState == 4 && colourXmlObject.status == 200) {
        var response = colourXmlObject.responseText;
        var xmlDoc = new DOMParser().parseFromString(response,'text/html');

        hexColour = "#" + xmlDoc.getElementsByTagName("hex")[0].innerText;
        setColour(hexColour);
      }
    };

    colourXmlObject.open("GET", colourUrl + ((/\?/).test(colourUrl) ? "&" : "?") + (new Date()).getTime(), true);
    colourXmlObject.send();
};

// Append the tweet anchor tag href with the supplied text
function updateTweet(string) {
  var tweetButton = document.getElementById('tweet');
  tweetButton.setAttribute('href', 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(string));
};
