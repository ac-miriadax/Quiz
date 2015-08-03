var models = require('../models/models.js');

// Autoload
exports.load = function(req, res, next, quizId){
  models.Quiz.findById(quizId).then(
    function(quiz){
      if(quiz){
        req.quiz = quiz;
        next();
      }
      else{
        next(new Error('No existe quizId=' + quizId));
      }
    }
  ).catch(function(error){next(error);});
};

// Carga el listado de preguntas disponibles
exports.index = function(req, res, next){
  models.Quiz.findAll().then(function(quizes){
    res.render('quizes/index.ejs', {quizes: quizes, errors: []});
  }).catch(function(error){next(error)});
};

// Carga el contenido de una pregunta
exports.show = function(req, res){
  res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// Comprueba si la respuesta es correcta o no
exports.answer = function(req, res){
  var resultado = 'Incorrecto';
  if(req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()){
      resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// Carga el formulario de pregunta nueva
exports.new = function(req, res){
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta", categoria: "Categoria"}
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
};

// Crea la pregunta nueva
exports.create = function(req, res){
  var quiz = models.Quiz.build(req.body.quiz);
  quiz.validate().then(
    function(err){
      if(err){
        res.render('/quizes/new', {quiz: quiz, errors: err.errors});
      }

      else{
        quiz.save({fields:["pregunta", "respuesta", "categoria"]}).then(function(){res.redirect('/quizes')})
      }
    }
  );
};

// Editamos una pregunta existente
exports.update = function(req, res){
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  req.quiz.validate().then(
    function(err){
      if(err){
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      }

      else{
        req.quiz.save({fields:["pregunta", "respuesta", "categoria"]}).then(function(){res.redirect('/quizes')})
      }
    }
  );
};

// Editar una pregunta
exports.edit = function(req, res){
  var quiz = req.quiz;

  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// Elimina una pregunta
exports.destroy = function(req, res, next){
  req.quiz.destroy().then(function(){
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};

// Este soy yo!!!
exports.author = function(req, res){
    res.render('author', { nombre: 'Abel Castosa' });
}
