const Servidor = require('./config/server');

require('dotenv').config();

const server = new Servidor();

server.listen();
