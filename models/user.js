const DB = require('../config/conex')
const crypto = require('crypto');

var sql;
const User = {};
/// retorna lisatdo tdo los usuarios
User.getAll = () => {
  sql = `SELECT * FROM USUARIOS WHERE is_active = true`;
  return DB.manyOrNone(sql);
}

//firtrado user by id
User.getUserById = (id) => {
  sql = `SELECT * FROM USUARIOS WHERE id= $1 and is_active = true`;
  return DB.oneOrNone(sql, id);
}

/// funcion para el token de session
User.functUserById= (id, callback) =>{
  sql = `SELECT * FROM USUARIOS WHERE id= $1`;
 return DB.oneOrNone(sql, id).then(user => {
  callback(null,user);
 });
}


//login query by user and psw

User.getUserByusers = (users) => {
  sql = `SELECT * FROM USUARIOS WHERE users= $1`;
  return DB.oneOrNone(sql, users);
}


/// create new user
User.createUser = (user) => {

  user.password = generarHashSHA256(user.password).trim();

  
  sql = `insert into usuarios(
    users,
    password,
    name,
    lastname,
    email,
    phone,
    is_active,
    session_token,
    created_at,
    modif_at
    )
    values(
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10
    ) returning id`;
    return DB.oneOrNone(sql, [
        user.users,
        user.password,
        user.name,
        user.lastname,
        user.email,
        user.phone,
        user.is_active,
        user.session_token,
        new Date(),
        new Date()         

    ])
}

/* Update USers --------------------------------- */
User.updateUsers = (iuser) => {
  iuser.password = generarHashSHA256(iuser.password).trim();

  sql = `
  UPDATE 
   USUARIOS 
   SET 
      password = $2,
      name = $3,
      lastname = $4,
      email = $5,
      phone = $6,
      is_active = $7,
      modif_at = $8
  WHERE id = $1`;

  return DB.oneOrNone(sql, [

    iuser.id,
    iuser.password,
    iuser.name,
    iuser.lastname,
    iuser.email,
    iuser.phone,
    iuser.is_active,
    new Date()
  ]);
}

/// inactivar usario  como si fuera un delete
User.UserModStatus = (id) => {
  sql = `UPDATE  USUARIOS
            SET is_active = false,
            modif_at  = $2
            WHERE id= $1`;
  return DB.result(sql,[id, new Date()]).then(result => {
    if (result.rowCount > 0)
      console.log('El registro se actualizó correctamente');
      else
      console.log('No se encontró ningún registro para actualizar con el ID:', result);
      
    return result;
  })
  .catch(error => {
    console.error('Ocurrió un error al actualizar el registro:', error);
    throw error; 
    });
  
}
//set token de sesion by user id 

User.updateTokenSession = (id, token) => {
  sql = `UPDATE
           USUARIOS
           SET session_token = $2
            WHERE id= $1`;
  return DB.oneOrNone(sql, [
    id,
    token
  ]);
}

User.isPasswordMached = (pswin, pswout) => {
  //#region
  // pswin=  `psw recivida desde la peticion`
  //pswout=  `psw recivida desde la base dato ya encryptda`
  //#endregion
  const mycurrentPws = generarHashSHA256(pswin);
  console.log(`pass entrada ${pswin}, \n 
                  pass  salida ${pswout} \n
                  pass firmada ${mycurrentPws}`)
  if (mycurrentPws === pswout) {
    return true;
  } else return false;
}
function generarHashSHA256(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  const hashedPassword = hash.digest('hex');
  //  console.log('La neuva contrasena es -------------------------------- >',hashedPassword)
  return hashedPassword;
}
module.exports = User
