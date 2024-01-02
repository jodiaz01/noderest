const promise = require('bluebird');
const opt = {
    promiseLib: promise,
    query: (e) => { }
}

const pgp = require('pg-promise')(opt);
const types = pgp.pg.types;

types.setTypeParser(1114, function (stringValues) {
    return stringValues;
});

const databaseConf = {
    'host': '127.0.0.1',
    'port': 5432,
    'database': 'dbloan',
    'user': 'postgres',
    'password': '1234'
}
const db = pgp(databaseConf);
module.exports = db;