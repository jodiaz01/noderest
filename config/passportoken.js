const JwtStategy = require('passport-jwt').Strategy
const ExtracrJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user')
const keys= require('../config/privatekey')

//formateando el JWT para exportar
module.exports =  function (passport){
    let opt = {}
    opt.jwtFromRequest = ExtracrJwt.fromAuthHeaderWithScheme('jwt');
    opt.secretOrKey = keys.secretOrKey,
    passport.use(new JwtStategy(opt,(jwt_payload, done)=>{
        //de controller le paso getuserbyID
        User.functUserById(jwt_payload.id,(error, user) => {
            if(error){
                return done(error,false);
            } if(user){
                return done(null, user);
            }else{
                return done(null,null);
            }
        });
    }))
}