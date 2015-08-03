var path = require('path');

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;


// Cargar modelo ORM
var Sequelize = require('sequelize');

// Esto es un hack muy churro pero me funciona. Al desplegar el proyecto en heroku
// el dialect cambia por 'postgres' y la base de datos local (quiz.sqlite) deja
// de funcionar. Lo que hago es comprobar si la línea DATABASE_STORAGE existe
// en el fichero .env o no, para cargar la configuración correcta de DDBB.
if(process.env.DATABASE_STORAGE != null){
  // Usar DDBB sqlite
  var dialect = 'sqlite'; var sequelize = new Sequelize (null, null, null, {dialect: dialect, storage: storage});}
else{
  // Usar DDBB postgres
  var sequelize = new Sequelize(DB_name, user, pwd,{
      dialect: protocol,
      protocol: protocol,
      port: port,
      host: host,
      storage: storage,
      omitNull: true
    }
  );
}

//Importar la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

exports.Quiz = Quiz;

//Crear e inicializar tabla de preguntas
sequelize.sync().then(function(){
  Quiz.count().then(function(count){
    //Inicializar tabla si está vacía
    if(count===0){
      Quiz.create({
        pregunta: 'Capital de Italia',
        respuesta: 'Roma'
      });
      Quiz.create({
        pregunta: 'Capital de Portugal',
        respuesta: 'Lisboa'
      }).then(function(){console.log('Base de datos creada con éxito')});
    };
  });
});
