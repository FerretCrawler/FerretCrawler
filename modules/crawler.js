var request = require('request');
var cheerio = require('cheerio');   // parse and select HTML elements on the page
var sleep = require('sleep');       // Sleep thread

var START_URL =  "http://vnexpress.net";
var SEARCH_WORD = "vnexpress";
var SLEEP_DURATION = 3;         // second

var pagesVisited = {};
var pagesToVisit = [];
var keywordIndexDefault = START_URL.toLowerCase().indexOf(SEARCH_WORD.toLowerCase()); // = 7 - Use for reject subdomain ...

// Start to crawl
function crawling () {
  var nextPage = pagesToVisit.pop();
  console.log("\nNext Page: " + nextPage);
  if (nextPage in pagesVisited) {
    // Page already visited
    crawling();
  } else {
    visitPage(nextPage, crawling);
  }
}

// Create request to specific page
function visitPage (url, callback) {
  pagesVisited[url] = true;

  // Delay some second to avoid blocking IP
  sleep.sleep(SLEEP_DURATION);

  // Make the request
  console.log('Visiting page ' + url);
  request(url, function(error, response, body) {
    if (error)
      next(error);

    // Check status code (200 is HTTP ok)
    // console.log("Status code: " + response.statusCode);
    if (response.statusCode == 200) {
      // Parse the document body
      var $ = cheerio.load(body);
      // console.log("Page title: " + $('title').text());
      // TODO: Scrapping content

      // Get hyperlinks - scrapping links
      collectAbsoluteLinks($);
      
      callback();
    }
  });
}

/*
  - Check same domain
  - Check subdomain
  - Check url inside url
  - Check exist in visited/visiting/adding
*/
function validateURL(url) {
  var isValid = false;
  var keywordIndex = url.toLowerCase().indexOf(SEARCH_WORD.toLowerCase());
  // console.log("Keyword index in domain: " + keywordIndex);
  if (keywordIndex !== -1 && keywordIndex == keywordIndexDefault) {
    isValid = true;
  } else
    // console.log("X> Link invalid");
  return isValid;
}

// Breadth First Crawler
function collectAbsoluteLinks($) {
  var allAbsoluteLinks = [];

  var absotuleLinks = $("a[href^='http']");

  absotuleLinks.each(function() {
    var link = $(this).attr('href');
    
    if (validateURL(link)) {
      if (link in pagesVisited || pagesToVisit.indexOf(link) !== -1 || allAbsoluteLinks.indexOf(link) !== -1) {
        // console.log("X> Link existed");
      } else {
        console.log("Found link: " + link);
        allAbsoluteLinks.push(link);
      }
    };
  });
   console.log("Found new " + allAbsoluteLinks.length + " absolute links");

   allAbsoluteLinks.forEach(function(value) {
    pagesToVisit.push(value);
   });

   console.log("Total need visit links: " + pagesToVisit.length);
}

// --------------------------
var crawl = function(domainName, res, next) {
  var url = "http://" + domainName;
  console.log("Crawling " + url);
  // request(url, function(error, response, html) {
  //   if(!error) {
  //     res.locals.html = html;
  //   } else {
  //     res.locals.html = null;
  //   }

  pagesToVisit.push(url);
  crawling();
  
  next();
};


module.exports.crawl = crawl;
