var express = require('express');
var router = express.Router();

var controller = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

router.get('/quizes/question', controller.question);
router.get('/quizes/answer', controller.answer);

module.exports = router;
