var URL = require('url');
var cheerio = require('cheerio');
var fs = require('fs');
var Args = require("vargs").Constructor;

var buildObject = function(url, $, obj) {
  var target_obj = {};
  console.log("Building object ...")
  target_obj.table = obj.name;
  target_obj.url = url;
  for (i in obj.props) {
    if (obj.props[i].type == "all")
      target_obj[obj.props[i].name] = $(obj.props[i].html).text();
    else if (obj.props[i].type == "raw")
      target_obj[obj.props[i].name] = $(obj.props[i].html);
    else
      target_obj[obj.props[i].name] = $(obj.props[i].html).first().text();
  }
  return target_obj;
}

var scrapContents = function(url, html, map) {
  var args = new Args(arguments);

  if (html != null) {
    console.log("Scrapping content ...");

    var $ = cheerio.load(html);

    if (map == null)
      map = URL.parse(url).host;

    fs.readFile('./site_maps/' + map + '.jmap', 'utf8', function(err, data) {
      console.log("Reading map file " + map + ".jmap ...")
      if (err)
        console.log(err);

      obj = JSON.parse(data);
      var target_obj = buildObject(url, $, obj);

      var listArgs = args.all;
      // console.log("listArgs: " + listArgs)
      listArgs.unshift(target_obj);
      args.callback.apply({}, listArgs);
    });
  } else {
    console.log("Nothing to scrap ...");
  }
}

module.exports.scrapContents = scrapContents;