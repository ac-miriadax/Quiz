var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

// Página principal, aquí empiezan todas mis desgracias
router.get('/', function(req, res, next) {
  res.render('index', { appname: 'Quiz', title: 'Portada', errors: [] });
});

// Autoload de comandos con quizId y commentId
router.param('quizId', quizController.load);
router.param('commentId', commentController.load);

// Rutas de sesión (crear, entrar y destruir... DESTRUIIIIIIRRRRRR!!!!)
router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);
// router.get('/myFreedom', miriadaHerokuAndGithubController.killThemAll);

// Rutas para las preguntas (mostrar, crear, editar...)
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);

// Rutas para los comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);

// Ruta para mi, porque me lo merezco
router.get('/author', quizController.author);

module.exports = router;
