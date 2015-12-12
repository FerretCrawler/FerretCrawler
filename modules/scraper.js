var URL = require('url');
var cheerio = require('cheerio');
var fs = require('fs');

var SEARCH_WORD = "vnexpress";

var scrapLinksFromURL = function(res, next) {
  if(res.locals.html != null)
    var $ = cheerio.load(res.locals.html);
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

var buildObject = function(url, $, obj, next){
  var target_obj = {};
  console.log("Building object ...")
  target_obj.table = obj.name;
  target_obj.url = url;
  for(i in obj.props) {
    if(obj.props[i].type == "all")
      target_obj[obj.props[i].name] = $(obj.props[i].html).text();
    else if(obj.props[i].type == "raw")
      target_obj[obj.props[i].name] = $(obj.props[i].html);
    else
      target_obj[obj.props[i].name] = $(obj.props[i].html).first().text();
  }
  console.log(target_obj);
  return target_obj;
}

var scrapContents = function(url, html, next, callback, map) {
  if(html != null){
    console.log("Scrapping content ...");
    var $ = cheerio.load(html);
    if(map == null)
      map = URL.parse(url).host;

    fs.readFile('./site_maps/' + map + '.jmap', 'utf8', function (err, data) {
      console.log("Reading map file ...")
      if (err)
        next(err);
      obj = JSON.parse(data);
      var target_obj = buildObject(url, $, obj, next);
      if(typeof callback == "function")
        callback(next, target_obj);
    });
  } else {
    console.log("Nothing to scrap ...");
    next();
  }
}

module.exports.scrapLinksFromURL = scrapLinksFromURL;
module.exports.scrapContents = scrapContents;
