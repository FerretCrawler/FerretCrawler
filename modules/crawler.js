var request = require('request');
var cheerio = require('cheerio'); // parse and select HTML elements on the page
var sleep = require('sleep'); // Sleep thread
var scraper = require('.././modules/scraper');
var Content = require('.././models/content');

var START_URL = "";
var SEARCH_WORD = "";
var SLEEP_DURATION = 1; // second

var pagesVisited = {};
var pagesToVisit = [];
var keywordIndexDefault = -1;

// Start to crawl
function crawling() {
  var nextPage = pagesToVisit.pop();
  console.log("\nCrawling: " + nextPage);
  if (nextPage in pagesVisited) {
    // Page already visited
    crawling();
  } else {
    visitPage(nextPage);
  }
}

// Create request to specific page
function visitPage(url) {
  pagesVisited[url] = true;

  // Delay some second to avoid blocking IP
  sleep.sleep(SLEEP_DURATION);
  // Make the request
  console.log('Visiting page: ' + url);

  if (url.match(/^http:\/\/(?!www.)([a-z.])*(:[0-9]*\/)?/i)) {
    request(url, {
      // Pretend to be a normal request
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0'
      },
      gzip: true
    }, function(error, response, html) {
      if (!error && response.statusCode == 200) {
        // Scrap the content based on .jmap file structure
        scraper.scrapContents(url, html, null, Content.insert);
        // Get hyperlinks - scrapping links
        // scraper.scrapContents(url, html, "link", getAllLinks);
      } else {
        console.log(error);
      }
    });
  } else {
    console.log("URL should follow this template : http://hostname.ext/...");
  }
}

// Breadth First Crawler
function getAllLinks(targetObj) {
  // Get all links
  var links = [];

  var allLinks = targetObj.information.url;
  // console.log("Links " + allLinks.length)
  for (var key in allLinks) {
    if (allLinks[key].attribs !== undefined && "href" in allLinks[key].attribs) {
      var url = allLinks[key].attribs.href;

      if (validateURL(url)) {
        if (url in pagesVisited || pagesToVisit.indexOf(url) > -1 || links.indexOf(url) > -1) {
          // console.log("X> Link existed");
        } else {
          // console.log("Found link: " + url);
          links.push(url);
          pagesToVisit.push(url);
        }
      };
    };
  };

  links.forEach(function(value) {
    var obj = {};
    obj.table = "links"
    obj.url = value;
    obj.status = false;

    Content.insert(obj);
  });

  console.log("Total need visit links: " + pagesToVisit.length);
  crawling();
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

  if (url.match(/^http:\/\/(?!www.)([a-z.])*(:[0-9]*\/)?/i)) {
    isValid = true;
  } else {
    return false;
  }

  if (keywordIndex > -1 && keywordIndex == keywordIndexDefault) {
    isValid = true;
  } else {
    // console.log("X> Link invalid");
    isValid = false;
  }

  return isValid;
}

// --------------------------
var crawl = function(url) {
  // url = "http://" + url;
  START_URL = url;

  var urlParts = url.replace('http://', '').replace('https://', '').split(/[/?#]/);
  SEARCH_WORD = urlParts[0];
  console.log("SEARCH_WORD: " + SEARCH_WORD);
  keywordIndexDefault = START_URL.toLowerCase().indexOf(SEARCH_WORD.toLowerCase()); // = 7 - Use for reject subdomain ...
  console.log("keywordIndexDefault: " + keywordIndexDefault);

  pagesToVisit.push(url);
  crawling();
};

var crawl_html = function(url) {
  console.log("Crawling " + url);
  if (url.match(/^http:\/\/(?!www.)([a-z.])*(:[0-9]*)?\//i)) {
    request(url, {
      // Pretend to be a normal request
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0'
      },
      gzip: true
    }, function(error, response, html) {
      if (!error) {
        // Scrap the content based on .jmap file structure
        scraper.scrapContents(url, html, null, Content.insert);
      } else {
        console.log(error);
      }
    });
  } else {
    console.log("URL should follow this template : http://hostname.ext/...");
  }
}


module.exports.crawl = crawl;
module.exports.crawl_html = crawl_html;
