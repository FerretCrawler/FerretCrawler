var express = require('express');
var crawler = require('.././modules/crawler');
var scraper = require('.././modules/scraper');
var Link = require('.././models/link');
var Content = require('.././models/content');

var router = express.Router();
var resp, content;

/* GET */
router.get('/', function(req, res, next) {
  res.send('Try to crawl something huh. \nPlease use /crawl/[YOUR_URL]');
});

/* GET Crawler */
router.get('/crawl/:url', function(req, res, next) {
  // Crawl html content from url
  crawler.crawl(req.params.url, res, next);
}, function(req, res, next) {
  // Scrap the content based on .jmap file structure
  scraper.scrapContents(req, res, next);
}, function(req, res, next) {
  // Scrap information from content and store into database
  scraper.scrapLinksFromURL(res.locals.html, res, next);
  next();
}, function(req, res, next) {
  // Save extracted data into database
  Content.insert(req, res, next, res.locals.objToSave);
  // res.send(res.locals.html);
  next();
});

module.exports = router;
