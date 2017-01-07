'use strict';

const parseArgs = require('minimist');
const fs = require('fs');
const db = require('./db');
const cheerio = require('cheerio');
const request = require('request');
const config = require('../config');

let params = parseArgs(process.argv.slice(2));

console.log('params', params);

let url = config.itinerary.url;
let blockSize = parseInt(params.size, 10) || 1000;
let shortName = params.short_name;

if(params.createDB) {
    createDatabase();
} else {
    main();
}

function createDatabase() {
    let sql = fs.readFileSync('scripts/create_database.sql').toString();
    db.run(sql);
}

function main() {
    getUpdatedData();
}

async function getUpdatedData() {
    let body = await doPost(url, config.itinerary.headers, config.itinerary.body.replace('<BUS_LINE>', shortName));
    let content = body.substring(4, body.length);
    let data = JSON.parse(content);
    let details = data[data.length-3];
    let rows = [];
    
    let row = {};
    for(let i=0; i<data.length-5; i++) {
        let value = data[i];
        
        if(i % 13 === 0) row = {};
        let j = (i % 13) + 1;
        
        switch(j) {
            case 1:
                row.route_short_name = details[value-1].split(' - ')[0];
                row.route_long_name = details[value-1];
                row.route_long_name = row.route_long_name.substring(row.route_short_name.length + 3, row.route_long_name.length);
                break;
            case 2:
                row.fare = value; break;
            case 4:
                row.service = details[value-1]; break;
            case 5:
                row.route_id = details[value-1]; break;
            case 6:
                row.city = details[value-1]; break;
            default:
                break;
        }
        
        if(i % 13 === 12) rows.push(row);
    }
    
    for(let i=0; i<rows.length; i++) {
        let routesUrl = config.itinerary.routes + rows[i].route_id;
        console.log('routesUrl', routesUrl);
        
        let body = await doReq(routesUrl);
        let $ = cheerio.load(body);
        
        let attr = $('form input').get().reduce((map, el) => {
            let $el = $(el);
            if($el.attr('name') != 'numero' && $el.attr('name') != 'route_name') map[$el.attr('name')] = $el.attr('value');
            return map;
        }, {});
        
        Object.assign(rows[i], attr);
    }
    
    console.log('rows', rows);
    
    generateSQL(rows);
}

function doPost(paramURL, headers, body) {
    return new Promise((resolve, reject) => {
        request.post({ url: paramURL, headers: headers, body: body }, function(err, res, content) {
            if(!err) {
                resolve(content);
            } else {
                reject(err);
            }
        });
    });
}

function doReq(paramURL) {
    return new Promise((resolve, reject) => {
        request.get(paramURL, function(err, res, body) {
            if(!err) {
                resolve(body);
            } else {
                reject(err);
            }
        });
    });
}

function generateSQL(rows) {
    let total = rows.length;
    let blocks = Math.ceil(total / blockSize);
    
    for(let i=0; i<blocks; i++) {
        let tempRows = rows.splice(0, Math.min(blockSize, rows.length));
        
        let sqlArray = generateInsert(tempRows);
        db.run(sqlArray.join(' '));
        
        let current = Math.min((i+1)*blocks, total);
        let msg = '\r\b\r\[TABLE\] routes - ' + current + '/' + total + ' = ' + parseInt(100*current / total, 10) + '%\r';
        process.stdout.write(msg);
    }
}

function generateInsert(rows) {
    const headerData = 'route_id, route_short_name, route_long_name, route_fare, route_service, route_city, route_headsign1, route_poly1, route_headsign2, route_poly2';
    const baseInsertSQL = 'INSERT INTO routes (' + headerData + ', created, updated) VALUES (##VALUES##, NOW(), NULL);';
    
    let sqlRows = [];
    
    for(let i=0; i<rows.length; i++) {
        let row = rows[i];
        
        let rowData = [
            row.route_id,
            "'" + row.route_short_name.replace(/'/gi, "''") + "'",
            "'" + row.route_long_name.replace(/'/gi, "''") + "'",
            row.fare,
            "'" + row.service.replace(/'/gi, "''") + "'",
            "'" + row.city.replace(/'/gi, "''") + "'",
            "'" + row.sentido1.replace(/'/gi, "''") + "'",
            "'" + row.poly.replace(/'/gi, "''") + "'",
            "'" + row.sentido2.replace(/'/gi, "''") + "'",
            "'" + row.poly2.replace(/'/gi, "''") + "'"
        ];
        
        let sql = baseInsertSQL.replace('##VALUES##', rowData.join(', '));
        
        sqlRows.push(sql);
    }
    
    return sqlRows;
}