const {Router} = require('express');
const passport = require('passport');// para la que requieran el token de seguridad
const {
    getAllControllers,
    createUserControllers,
    loginControllers,
    updateUserControllers,
    getUserByID,
    InativeUserController,
    logoutWithToken
    } = require('../controllers/user_controller')

const routes = Router();


routes.get('/api/users', getAllControllers);
routes.get('/api/usersID/:id', passport.authenticate('jwt', {session:false}),  getUserByID);
routes.get('/api/logout/:id/:token',  logoutWithToken);
routes.post('/api/newusers', createUserControllers);
routes.post('/api/login', loginControllers);
routes.put('/api/update', updateUserControllers);
routes.put('/api/inactive/:id', InativeUserController );

module.exports = routes