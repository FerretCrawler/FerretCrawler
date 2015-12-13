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

var getProps = function(html, map_obj){
  var $ = cheerio.load(html);
  console.log("Getting props from " + map_obj.name);
  var target_obj = [];

  for(i in map_obj.props) {
    props = map_obj.props[i]
    if(props.html != null)
      html = $(props.html).html();
    if(props.hasOwnProperty("props"))
      target_obj[props.name] = getProps(html, props);
    if(props.type == "all")
      target_obj[props.name] = extractData($, props.attr, $(props.html));
    else
      target_obj[props.name] = extractData($, props.attr, $(props.html).first());
  }
  return target_obj;
}

var buildObject = function(url, html, map_obj){
  var target_obj = {};
  console.log("Building object ...")
  target_obj.table = map_obj.name;
  target_obj.url = url;
  target_obj["information"] = getProps(html, map_obj);
  console.log(target_obj.information);
  return target_obj;
}

var scrapContents = function(url, html, map_file) {
  var args = new Args(arguments);

  if (html != null) {
    console.log("Scrapping content ...");

    var $ = cheerio.load(html);
    if(map_file == null)
      map_file = URL.parse(url).host;

    fs.readFile('./site_maps/' + map_file + '.jmap', 'utf8', function (err, data) {
      console.log("Reading map file " + map_file + ".jmap ...")
      if (err)
        console.log(err);
      map_obj = JSON.parse(data);
      if(map_obj.html == null)
        map_obj.html = "body"
      var target_obj = buildObject(url, $(map_obj.html).html(), map_obj);
      var listArgs = args.all;
      listArgs.unshift(target_obj);
      args.callback.apply({}, listArgs);
    });
  } else {
    console.log("Nothing to scrap ...");
  }
}

module.exports.scrapContents = scrapContents;