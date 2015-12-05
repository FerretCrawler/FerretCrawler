var request = require('request');

var crawl = function(domainName, res, next) {
  var url = "http://" + domainName;
  console.log("Crawling " + url);
  request(url, function(error, response, html){
    if(!error) {
      res.locals.html = html;
    } else {
      res.locals.html = null;
    }
    next();
  });
};

module.exports.crawl = crawl;
