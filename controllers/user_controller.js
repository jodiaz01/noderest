const userCont = require('../models/user')
const jwt = require('jsonwebtoken');
const jmykeys = require('../config/privatekey');

module.exports = {
    // login

    async loginControllers(req, resp, next) {
        try {
            const usernick = req.body.users;
            const psw = req.body.password;

            //revisar si existe el usuario
            const user_data = await userCont.getUserByusers(usernick);
            if (!user_data) {
                return resp.status(401).json({
                    message: `Este usuario ${usernick} no Se encuentra disponible`,
                    success: false
                });
            }

            //validar la psw  de la bd vs  la que envio con el metodo isPasswordMached()
            if (userCont.isPasswordMached(psw, user_data.password)) {


                const createToken = firmaTokenDigital(user_data);
                const Sjwt = `JWT ${createToken}` /* 'sele add JWT porque sin el JWT no lo reconoce valido para  el header Authorizations' */
                const data = {
                    id: user_data.id,
                    users: user_data.users,
                    password: user_data.password,
                    name: user_data.name,
                    lastname: user_data.lastname,
                    email: user_data.email,
                    phone: user_data.phone,
                    is_active: user_data.is_active,
                    session_token: Sjwt,
                    created_at: user_data.created_at,
                    modif_at: user_data.modif_at

                }
                //generamos el token por sesion del usuarios-----------------

                await userCont.updateTokenSession(user_data.id, Sjwt);

                return resp.status(200).json(data);
            } else {
                return resp.status(401).json({
                    success: false,
                    message: 'No tiene Usario Con Esta Credenciales: ' + psw
                });

            }
        } catch (error) {
            return errorNotifications(error, resp);
        }
    },


    // controller all user---------------------
    async getAllControllers(req, resp, next) {
        try {
            const data = await userCont.getAll();
            //  console.log(`listado de usuario : ${data}`);
            return resp.status(200).json(data);
        } catch (error) {
            return errorNotifications(error, resp);
        }
    },

    // get user by ID ------------------------

    async getUserByID(req, resp, next) {
        try {
            const id = req.params.id
            const user_data = await userCont.getUserById(id)
            if (user_data) {
                return resp.status(200).json({
                    message: `user`,
                    success: true,
                    data: user_data
                });
            }
            else {
                return resp.status(404).json({
                    message: `El Id #${id} No tiene user`,
                    success: false,
                });
            }


        } catch (error) {
            return errorNotifications(error, resp);
        }
    },



    // create users ------------------------
    async createUserControllers(req, resp, next) {
        try {
            const user = req.body;
            const data = await userCont.createUser(user);

            return resp.status(201).json({
                success: true,
                message: 'Regisgtro Creado Existosamente',
                data: data.id
            });

        } catch (error) {
            errorNotifications(error, resp)

        }
    },


    /*---------UPDATE USERS----------------------------- */

    async updateUserControllers(req, resp, next) {
        try {
            const user = req.body;
            // console.log(user)   
            await userCont.updateUsers(user);

            return resp.status(201).json({
                message: 'Modificado Correctamente',
                success: true,
                data: user
            });

        } catch (error) {
            return errorNotifications(error, resp);
        }
    },

    // delete  users or incative status 
    async InativeUserController(req, resp, next) {
        try {
            const id = req.params.id
            const user_data = await userCont.UserModStatus(id)

            if (user_data) {
                return resp.status(200).json({
                    message: `Usuario Inactivo`,
                    success: true,

                });
            }
            else {
                return resp.status(404).json({
                    message: `El Id #${id} No tiene Existe`,
                    success: false,
                });
            }


        } catch (error) {
            return errorNotifications(error, resp);
        }
    },

    // revisa si el token esta activo y si no lo delogea

    async  logoutWithToken(req, resp,next) {
        const userID= req.params.id
        const token = req.params.token
        // const NewTok= token.replace('JWT ', '')
        try {
            const verify = verifyToken(token);
            if (!verify) {
                // console.log('Token válido. Datos decodificados:', verify);
                await userCont.updateTokenSession(userID, null);
                return resp.status(501).json({
                    message: 'Token No  válido.',
                    success: false,
                });
            } 
            else {
                return resp.status(200).json({
                    message:'Token Activo',
                    success:true,
                    data:verify
                })
            }
        } catch (error) {
            return errorNotifications(error, 'Token espirado')
        }
    }
    
    
}

/* 
#region 
0- si existe generara un nuevo token por sescion.
1- firmado por lok le pase a los claims  
2- nomeclatura en secretOrkey
//#endregion
*/
function firmaTokenDigital(user) {
    return jwt.sign({
        id: user.id,
        name: jmykeys.name,
        version: jmykeys.version,
        date: jmykeys.year,
        owner: jmykeys.create
    }, jmykeys.secretOrKey,
        {
            expiresIn: (60 * 2)
            // expiresIn: (60 * 60 * 24)
        }

    );
}

//checkea token
function verifyToken(token) {
    try {
        return jwt.verify(token, jmykeys.secretOrKey)
    } catch (error) {
        return false;
    }
}

// valida session del token --



// setTimeout(async ()=>{
//    const usertooenk="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYW1lIjoibm9kZXNlcnYiLCJ2ZXJzaW9uIjoiMS4wLjEiLCJkYXRlIjoyMDI0LCJvd25lciI6ImpkaWF6IiwiaWF0IjoxNzA0MzAzMDM2LCJleHAiOjE3MDQzMDMxNTZ9.Mt6VJm51RkwS3Ep6Ee5BsU1XOAaGk5ywbE6jFKPauLs";
//     const verify = verifyToken(usertooenk)
//     if (verify) {
//         console.log('Token válido. Datos decodificados:', verify);
//       } else {
//         console.log('Token No válido Tiempo expirado ');
//         //quito el token al usuario
//         await userCont.updateTokenSession(1, null);
//       }
// }, 2000)

//retornando  en caso de ocurra un errors
function errorNotifications(error, resp) {
    console.error(error);
    return resp.status(404).json({
        message: 'metodo no disponible',
        success: false
    });
}

