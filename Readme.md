# confg: contiene {
    server: `configuracion de servidor`,
    conex:`conf de conexion database postgres`
}

# region -- Detalle conex {

const promise = require('bluebird'); `instacinado bluebird con la variable promise`
`configuracion para poder realizar query   query  `
# const opt = {
    promiseLib: promise,
    query: (e) => { }
}

const pgp = require('pg-promise')(opt);
const types = pgp.pg.types;

`PGP uso de la bariable de la instancia de pg del paquete pg-posgress
`conf recive string tipo query`
types.setTypeParser(1114, function (stringValues) {
    return stringValues;
})
`conf database `
# databaseConf = {
'host': '127.0.0.1',
    'port': 5432,
    'database': 'dbloan',
    'user': 'postgres',
    'password': 'admin'
}
`exportacion de mi conex db`
const db = pgp(databaseConf);
module.exports = db;
}
# endregion-------------------------------------------------------

# modells `config basica de modelos ` 
# region models --------------------------------------------------
const  DB = require('../config/conex') `exportaciones de conexion psql`
const crypto = require('crypto'); `para encryptal la pass`

`metodo para encryptacion *************************************`
function generarHashSHA256(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    const hashedPassword = hash.digest('hex');
    return hashedPassword;
  }
# endregion models -----------------------------------------------


# controllers = `metodo asyn  quien hace la peticion de models`

# region 
0- si existe generara un nuevo token por sescion.
1- firmado por lok le pase a los claims  
2- nomeclatura en secretOrkey
`ejemplo del firmado ***************************`
jwt.sign({
    id: `id del usuario  por cada user`
        name: `nombre del servidor` ,
        version: `version del servidor`,
        date:`anos de emision`,
        owner: `firmado por el devep` 
    }, jmykeys.secretOrKey `key generade sha256 mas una hora de vigencia`,
        {
            expiresIn: (60 * 60 * 24)
        }
 
});
# endregion
# region  Notificacion de errores--------------------------------------------
//retornando  en caso de ocurra un error
function errorNotifications(error, resp) {
    console.error(error);
    return resp.status(404).json({
        message: 'metodo no disponible',
        success: false
    });
}
# endregion --------------------------------------------

`ROUTES `
# region --------------------------------------------
dicionario  de rutas para poder usar el api
const {Router} = require('express'); `map de router`
`ejemplo de uso ************************************`
const {
    getAllControllers,
    } = require('../controllers/user_controller')
const routes = Router();

routes.get('/api/users', getAllControllers);
# endregion --------------------------------------------


# Region Posible error -----------------------------
si da problema de authenticasion con un mensaje como el sgte.
Login sessions require session support. Did you forget to use `express-session` middleware?
comentar en servers.js
` this.app.use(passport.session()); `
luego intentar y descomentar
# endRegion Posible error -----------------------------


# region Pruebas urls
{(
 `1- -----obtner lista de usuarios -------- ` 
    `**Request GET: No incluyte parametross**`   
    127.0.0.1:3000/api/users 

 `2-  ----------create nuevo users ----------`
    `**Request POST: en el cuerpor podemos hacer un  POST  `
        127.0.0.1:3000/api/newusers 
`body add.`
  {
    "users": "jodiaz",
    "password": "123",
    "name": "jonan",
    "lastname": "diaz",
    "email": "enairodiaz@gmail.com",
    "phone": "809-125-1212 ",
    "is_active": true,
    "session_token": ""
  }
  `3- ---- login POST  `
    `** Request POST en el cuerpo body enviar users  y password`
    127.0.0.1:3000/api/login
      `body add. OJO las password no debe irencryptada aqui`
     {
     "users": "jodiaz",
    "password": "1234"
  }
  `4- actualziar PUT UPDATE`
   `** Request PUT OR UPDATE--- ***`
   127.0.0.1:3000/api/update
   `body add. `
   {
    "id": "1",
    "users": "jodiaz",
    "password": "1234",
    "name": "jonan",
    "lastname": "diaz diaz",
    "email": "enairodiaz@gmail.com",
    "phone": "809-125-1212 ",
    "is_active": true
  }
    `5- obtener un usuarios con exigencia de un token vgente `
    ` Request GET  lleva parametro por  header **`
   127.0.0.1:3000/api/usersID/1
   `en el header especificar el token o session token `
   Authorization  = JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYW1lIjoibm9kZXNlcnYiLCJ2ZXJzaW9uIjoiMS4wLjEiLCJkYXRlIjoyMDI0LCJvd25lciI6ImpkaWF6IiwiaWF0IjoxNzA0MjE4NjA3LCJleHAiOjE3MDQzMDUwMDd9.-ltBlPzl1u0mdyuuGsLMVY__69UG1mP49sO7tvC35Rw

)}
#  endregion ---------------- 