var URL = require('url');
var cheerio = require('cheerio');
var fs = require('fs');
var Args = require("vargs").Constructor;

var extractData = function($, attr, tags) {
  var data = [];
  if (attr == null)
    return tags;

  tags.each(function(index, element) {
    if (attr == "text")
      data[index] = $(element).text();
    else
      data[index] = $(element).attr(attr);
  });
  return data;
}

var buildObject = function(url, $, obj) {
  var target_obj = {};
  console.log("Building object ...")
  target_obj.table = obj.name;
  target_obj.url = url;
  for (i in obj.props) {
    if (obj.props[i].type == "all")
      target_obj[obj.props[i].name] = extractData($, obj.props[i].attr, $(obj.props[i].html));
    else
      target_obj[obj.props[i].name] = extractData($, obj.props[i].attr, $(obj.props[i].html).first());
  }
  console.log(target_obj);
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
      listArgs.unshift(target_obj);
      args.callback.apply({}, listArgs);
    });
  } else {
    console.log("Nothing to scrap ...");
  }
}

module.exports.scrapContents = scrapContents;