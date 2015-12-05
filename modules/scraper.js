var cheerio = require('cheerio');
var fs = require('fs');

var scrapLinksFromURL = function(html, res, next) {
  var $ = cheerio.load(html);
  res.locals.links = $('a').get();
};

var scrapContents = function(html, res, next) {
  var $ = cheerio.load(html);

  fs.readFile('./site_maps/vnexpress.net.jmap', 'utf8', function (err, data) {
    if (err)
      next(err);
    obj = JSON.parse(data);
    var base_html = obj.html;
    for(i in obj.props) {
      obj.props[i].content = $(base_html + " " + obj.props[i].html).text();
      console.log(obj.props[i]);
    }
  });
}

module.exports.scrapLinksFromURL = scrapLinksFromURL;
module.exports.scrapContents = scrapContents;
