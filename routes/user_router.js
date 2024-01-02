const {Router} = require('express');
const passport = require('passport');// para la que requieran el token de seguridad
const {
    getAllControllers,
    createUserControllers,
    loginControllers,
    updateUserControllers,
    getUserByID
    } = require('../controllers/user_controller')

const routes = Router();


routes.get('/api/users', getAllControllers);
routes.get('/api/usersID/:id', passport.authenticate('jwt', {session:false}),  getUserByID);
routes.post('/api/newusers', createUserControllers);
routes.put('/api/update', updateUserControllers);
routes.post('/api/login', loginControllers);

module.exports = routes