# tavindo-load-data

Gather data from different places to build a single database for the bus transport system from Rio de Janeiro.

## General Info

It was developed using Node 7 and async/await, so be careful to set your environment correctly before installing dependencies and running the application. I recommend using NVM for node version management.

## Configuration

All necessary configuration info is explicit on `config.default.js`. It should be updated to reflect your environment, renamed to `config.js` and put outside project. Currently it's pointing to your projects's parent folder. When you decide to relocate elsewhere, don't forget to update its references on `db.js` and `index.js`.

```
db: {
    user: 'user', // database user
    password: 'password', // database password
    host: 'localhost', // database host
    database: 'database' // database schema
},
itinerary: {
    url: '', // URL to the website where you gather the general info
    headers: [],
    body: '',
    routes: '' // URL to the website where you gather the routes of each bus line
}
```

### Database

It was designed to work with PostgreSQL, but you can use any database you want. In that case, you'll probably need to change `db.js`.

#### Creating your database

Once you installed PostgreSQL, you will need to create your user and schema. If you are clueless on database configuration, all you need to do is execute the two commands below:

    $ createuser -d -P -s <user_name>
    $ createdb -O <user_name> <database_name>

The first one will create your user, the second will create your schema. The user name and schema name must match whatever is on your `config.js`.

Once everything is set, run `npm run create:db`, so the necessary tables are created. This only needs to be done once, but has to be ran before anything else.

After creating the tables, you're good to go.

## Running

Run `npm start`. It will get the info from `config.js` and it'll start to gather everything. But it will take a long time since there are around 3000 bus lines in the entire Rio de Janeiro metropolitan area. Because of that, it was designed to **NOT** run things in parallel, otherwise your queries could be perceived as an attack. It **IS** designed to run in sequence and it **IS** designed to be slow. Actually it should be even slower.

If you want to get data from a specific bus route, you can pass it as argument, just run

```npm start -- --short_name=100```

In this example, it will search for all bus lines that contains `100` on its short name.

## License

MIT. See `LICENSE` file.