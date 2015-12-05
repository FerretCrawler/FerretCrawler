var express = require('express');
var crawler = require('.././modules/crawler');
var scraper = require('.././modules/scraper');
var Link = require('.././models/link');

var router = express.Router();
var resp, content;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Crawler main page' });
});

router.get('/crawl/:url', function(req, res, next) {
  // Crawl html content from url
  // crawler.crawl(req.params.url, res, next);
  var urlObj = '{"url": ' + req.params.url + ', "status": 1}';
  Link.save(req, res, next, urlObj);
  next();
}, function(req, res, next) {
  // Checking requirements
  // Link.checkCollectionExists(req, res, next);
  next();
}, function(req, res, next) {
  // Save crawled url into database
  // var urlObj = '{"url": ' + req.params.url + ', "status": 1}';
  // Link.save(req, res, next, urlObj);
  res.send(res.locals.html);
}, function(req, res, next) {
  // Scrape information from content and store into database
  scraper.scrapLinksFromURL(res.locals.html, res, next);
  scraper.scrapContents(res.locals.html, res, next);
});

module.exports = router;
