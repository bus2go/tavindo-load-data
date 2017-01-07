const pg = require('pg');
const config = require('../config');

const pool = new pg.Pool({
    user: config.db.user,
    password: config.db.password,
    host: config.db.host,
    database: config.db.database,
    max: 10, // max number of clients in pool
    idleTimeoutMillis: 1000, // close & remove clients which have been idle > 1 second
})
.on('error', function(err, client) {
    console.log('pool.err:', err);
    throw err;
});

module.exports = pg;
module.exports.run = (sql, params, cbDone) => {
    pool.query(sql, params, function(err, rows) {
        if (err) {
            console.log('run.err:', sql, err);
            throw err;
        }
        
        if(cbDone) cbDone(rows);
    });
};