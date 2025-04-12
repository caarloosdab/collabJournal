const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;

let database;

const intDb = (callback) => {
    if (database) {
        console.log('Db is already initialized!');
        return callback(null, database);
    }
    MongoClient.connect(process.env.MONGODB_URL)
    .then(client => {
        database = client;
        callback(null, database);
    })
    .catch(err => {
        callback(err);
    });
};

const getDataBase = () => {
    if(!database) {
        throw Error('Dtabase not initialized');
    }
    return database;
};

module.exports = {
    intDb,
    getDataBase
};