var express = require('express');
var crawler = require('.././modules/crawler');
var Link = require('.././models/link');

var router = express.Router();
var resp, content;

/* GET */
router.get('/', function(req, res, next) {
  res.send('Try to crawl something huh. \nPlease use /crawl/[YOUR_URL]');
});

/* GET Crawler */
router.get('/crawl/:url', function(req, res, next) {
  // Crawl html content from url
  // crawler.crawl_html(req.params.url);
  crawler.crawl(req.params.url);
  next();
});

module.exports = router;
