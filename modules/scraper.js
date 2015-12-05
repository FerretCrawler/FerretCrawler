var cheerio = require('cheerio');
var fs = require('fs');

var SEARCH_WORD = "vnexpress";

var scrapLinksFromURL = function(html, res, next) {
  var $ = cheerio.load(html);
  // res.locals.links = $('a').get();
  // var pagesToVisit = 
  // var allAbsoluteLinks = [];

  // var absotuleLinks = $("a[href^='http']");

  // absotuleLinks.each(function() {
  //   var link = $(this).attr('href');
  //   console.log("Found link: " + link);

  //   // check link still stay inside crawling domain.
  //   if (url.toLowerCase().indexOf(SEARCH_WORD.toLowerCase()) !== -1) {
  //     // How to check link is already visited/ visiting/ added ?
  //     if (link in pagesVisited || pagesToVisit.indexOf(link) !== -1 || allAbsoluteLinks.indexOf(link) !== -1) {
  //       console.log(" --> Link existed");
  //     } else {
  //       allAbsoluteLinks.push(link);
  //     }
  //   };
  // });
  //  console.log("Found new " + allAbsoluteLinks.length + " absolute links");

  //  //
  //  allAbsoluteLinks.forEach(function(value) {
  //   pagesToVisit.push(value);
  //  });

  //  console.log("Total need visit " + pagesToVisit.length + " links");
  //  next();
}

var scrapContents = function(html, res, next) {
  console.log("Scrapping content ...");
  var $ = cheerio.load(html);

  fs.readFile('./site_maps/vnexpress.net.jmap', 'utf8', function (err, data) {
    if (err)
      next(err);
    obj = JSON.parse(data);
    var base_html = obj.html;
    for(i in obj.props) {
      obj.props[i].content = $(base_html + " " + obj.props[i].html).text();
    }
    res.locals.objToSave = obj;
    next();
  });
}

module.exports.scrapLinksFromURL = scrapLinksFromURL;
module.exports.scrapContents = scrapContents;
