var users = {
   admin: {id: 1, username:"admin", password: "1234"},
   ac: {id: 2, username:"ac", password: "abcd"}
};

// Comprobamos si el usuario está registrado
// Si algo falla (no usuario, mal contraseña) lanzamos error
exports.autenticar = function(login, password, callback){
   if(users[login]){
      if(password === users[login].password){
         callback(null, users[login]);
      }

      else{
         callback(new Error('¿Seguro que eres tú?'));
      }
   }

   else{
      callback(new Error('No, no conocemos a nadie con ese nombre'));
   }
};
