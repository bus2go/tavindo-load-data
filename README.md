# tavindo-load-data

Gather data from different places to build a single database for the bus transport system from Rio de Janeiro.

## General Info

It was developed using Node 7 and async/await, so be careful to set your environment correctly before installing dependencies and running the application. I recommend using NVM for node version management.

## Configuration

All necessary configuration info is explicit on `config.default.js`. It should be updated to reflect your environment, renamed to `config.js` and put outside project. Currently it's pointing to your projects's parent folder. When you decide to relocate elsewhere, don't forget to update its references on `db.js` and `index.js`.

### Database

It was designed to work with PostgreSQL, but you can use any database you want. In that case, you'll probably need to change `db.js`.

```
db: {
    user: 'user', // database user
    password: 'password', // database password
    host: 'localhost', // database host
    database: 'database' // database instance
},
itinerary: {
    url: '', // URL to the website where you gather the general info
    headers: [],
    body: '',
    routes: '' // URL to the website where you gather the routes of each bus line
}
```

### `setup-database.sh`

If you are clueless on database configuration, this script should help you with the bare minimum. It creates a database and a user that you can use. Considering you already have PostgreSQL installed in your environment, just run `bash setup-database.sh` and it will prompt you for the password you would like to use.

## Running

Once everything is set, run `npm start` and it will get the info from `config.js`, build the database (if necessary) and it'll start to gather everything. But it will take a long time since there are around 3000 bus lines in the entire Rio de Janeiro metropolitan area. Because of that, it was designed to NOT run things in parallel, otherwise your queries could be perceived as a DDoS attack. It IS designed to run in sequence and it IS designed to be slow. Actually it should be even slower.

If you want to get data from a specific bus route, you can pass it as argument, just run `npm start -- --short_name=100`. In this example, it will search for all bus lines that contains `100` on its short name.

## License

MIT. See `LICENSE` file.