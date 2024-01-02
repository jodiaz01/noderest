const express = require('express')
const logger = require('morgan')
const cor = require('cors');
const passport = require('passport')// para la que requieran el token de seguridad
class Servidor {
    constructor() {
        this.app = express();
        this.port = process.env.PORT ;
        this.ipserver = process.env.IPServer;
        this.middleware();
        this.routes();
        
        //recivo de token
         this.app.use(passport.initialize());
         this.app.use(passport.session());
        require('../config/passportoken')(passport)
    }

    routes() {
        //rutas usario 
        this.app.use(require('../routes/user_router'));
        //si tengo otra rutas add debajo

        }

    middleware(){
       this.app.disable('x-powered-by');
        this.app.use(logger('dev'));
        this.app.use( express.json() );
        this.app.use(express.urlencoded({
            extended:true
        }));
        this.app.use(cor());

        this.app.use((err, req,resp, next)=>{
            console.log(err);
            resp.status(err.status || 500).send(err.stcak)
        });
    }

    listen(){
       
        this.app.listen(this.port, ()=>{
    
            console.log('servidor corriendo en:', `http://${this.ipserver}:${this.port}`)
        });
    }
}
module.exports = Servidor;

