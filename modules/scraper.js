var cheerio = require('cheerio');
var fs = require('fs');

var scrapLinksFromURL = function(html, res, next) {
  var $ = cheerio.load(html);
  res.locals.links = $('a').get();
};

var scrapContents = function(req, res, next) {
  console.log("Scrapping content ...");
  var html = res.locals.html;
  var $ = cheerio.load(html);

  fs.readFile('./site_maps/stackoverflow.com.jmap', 'utf8', function (err, data) {
    console.log("Reading map file ...")
    if (err)
      next(err);
    obj = JSON.parse(data);
    var target_obj = {};
    console.log("Building object ...")
    target_obj.table = obj.name;
    target_obj.url = req.params.url;
    var base_html = obj.html;
    for(i in obj.props) {
      if(obj.props[i].type == "all")
        target_obj[obj.props[i].name] = $(obj.props[i].html).text();
      else
        target_obj[obj.props[i].name] = $(obj.props[i].html).first().text();
    }
    console.log(target_obj);
    res.locals.objToSave = target_obj;
    next();
  });
}

module.exports.scrapLinksFromURL = scrapLinksFromURL;
module.exports.scrapContents = scrapContents;
