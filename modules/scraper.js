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

var buildProps = function($, prop_map_obj){
  var target_obj = {};
  var args = new Args(arguments);
  if(prop_map_obj.html != null)
    html = $(prop_map_obj.html).parent().html();
  if(prop_map_obj.hasOwnProperty("props")) {
    getProps(html, prop_map_obj, function(extracted_information){
      console.log(extracted_information);
      target_obj = extracted_information;
    });
  } else {
    if(prop_map_obj.type == "all")
      target_obj = extractData($, prop_map_obj.attr, $(prop_map_obj.html));
    else
      target_obj = extractData($, prop_map_obj.attr, $(prop_map_obj.html).first());
  }
  var listArgs = args.all;
  listArgs.unshift(target_obj);
  args.callback.apply({}, listArgs);
}

var getProps = function(html, map_obj){
  var $ = cheerio.load(html);
  var target_obj = {};
  var args = new Args(arguments);

  for(i in map_obj.props) {
    var property = map_obj.props[i];
    buildProps($, property, function(properties){
      target_obj[property.name] = properties;
    });
  }
  var listArgs = args.all;
  listArgs.unshift(target_obj);
  args.callback.apply({}, listArgs);
}

var buildObject = function(url, html, map_obj){
  var target_obj = {};
  var args = new Args(arguments);
  if(map_obj.name == "article")
    console.log("Building object from: " + url)
  target_obj.table = map_obj.name;
  target_obj.url = url;
  getProps(html, map_obj, function(extracted_information){
    target_obj["information"] = extracted_information;
    var listArgs = args.all;
    listArgs.unshift(target_obj);
    args.callback.apply({}, listArgs);
  });
}

var scrapContents = function(url, html, map_file) {
  var args = new Args(arguments);
  if(map_file != "link")
    console.log(args.callback.name);
  if (html != null) {
    console.log("Scrapping content ...");

    // var $ = cheerio.load(html);
    if(map_file == null)
      map_file = URL.parse(url).host;

    fs.readFile('./site_maps/' + map_file + '.jmap', 'utf8', function (err, data) {
      console.log("Reading map file " + map_file + ".jmap ...")
      if (err)
        console.log(err);
      map_obj = JSON.parse(data);
      buildObject(url, html, map_obj, function(target_obj){
        var listArgs = args.all;
        listArgs.unshift(target_obj);
        args.callback.apply({}, listArgs);
      });
    });
  } else {
    console.log("Nothing to scrap ...");
  }
}

module.exports.scrapContents = scrapContents;
