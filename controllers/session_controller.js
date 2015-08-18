// Acceso restringido, sólo puedes continuar con sesión iniciada
exports.loginRequired = function(req, res, next){
   if (req.session.user) {
      next();
   } else {
      res.redirect('/login');
   }
};

// Formulario de acceso
exports.new = function(req, res) {
   var errors = req.session.errors || {};
   req.session.errors = {};

   res.render('sessions/new', {title:'Acceso', errors: errors});
};

// Crea la sesión
exports.create = function(req, res) {
   var login = req.body.login;
   var password  = req.body.password;
   var timestamp = (new Date()).getTime();

   var userController = require('./user_controller');
   userController.autenticar(login, password, function(error, user) {
      if (error) {  // Si algo falla... pues...
         req.session.errors = [{"message": 'Algo ha salido mal, muy mal de hecho: ' +error}];
         res.redirect("/login");
         return;
      }
      // Crear req.session.user y guardar los campos  id y username
      // La sesión se define por la existencia de:    req.session.user
      req.session.user = {
         id: user.id,
         username: user.username,
         lastAction: timestamp
      };

      // redirección a la página anterior
      res.redirect(req.session.redir.toString());
   });
};

// DELETE / Logout   -- Salir de la sesion (eliminarla)
exports.destroy = function(req, res) {
   delete req.session.user;
   res.redirect(req.session.redir.toString());
};
