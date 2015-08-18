var models = require('../models/models.js');

// Cargar el comentario #commentId para moderación
exports.load = function(req, res, next, commentId) {
   models.Comment.find({
      where: {
         id: Number(commentId)
      }
   }).then(function(comment) {
      if (comment) {
         req.comment = comment;
         next();
      } else{next(new Error('No existe el comantario con Id #' + commentId))}
   }
  ).catch(function(error){next(error)});
};

// Crear nuevo comentario
exports.new = function(req, res){
  res.render('comments/new.ejs', {quizid: req.params.quizId, title: 'Enviar comentario', errors: []});
};

// Enviar comentario pendiente de moderación
exports.create = function(req, res){
  var comment = models.Comment.build({
    texto: req.body.comment.texto,
    QuizId: req.params.quizId
 });
  comment.validate().then(
    function(err){
      if(err){
        res.render('/comments/new.ejs', {comment: comment, quizid: req.params.quizId, title: 'Enviar comentario', errors: err.errors});
      }

      else{
        comment.save().then(function(){res.redirect('/quizes/'+req.params.quizId)})
      }
    }
).catch(function(error){next(error)});
};


// Publicar comentario ya publicado (aceptar en moderación)
exports.publish = function(req, res) {
   req.comment.publicado = true;

   req.comment.save( {fields: ["publicado"]})
   .then(function(){ res.redirect('/quizes/' + req.params.quizId);})
   .catch(function(error){next(error);});
};
