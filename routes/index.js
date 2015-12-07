var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

router.use(bodyParser());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ferret Crawler', site: 'http://vnexpress.net' });
});

/* POST */
router.post('/', function(req, res) {
	res.send('Got a POST request: ');
});

module.exports = router;
