/*
README

This file should be renamed to config.js and put outside project,
preferably on its parent folder. Case you need to relocate elsewhere,
don't forget to update its references on db.js and index.js.
*/

module.exports = {
    db: {
        user: 'user',
        password: 'password',
        host: 'localhost',
        database: 'database'
    },
    itinerary: {
        url: '',
        headers: [],
        body: '',
        routes: ''
    }
};