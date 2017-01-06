DROP TABLE IF EXISTS routes;

CREATE TABLE routes (
    route_id int primary key,
    route_short_name varchar,
    route_long_name varchar,
    route_fare decimal,
    route_service varchar,
    route_city varchar,
    route_headsign1 varchar,
    route_poly1 varchar,
    route_headsign2 varchar,
    route_poly2 varchar,
    created timestamp,
    updated timestamp
);

CREATE INDEX in_routes_short ON routes(route_short_name);
CREATE INDEX in_routes_city ON routes(route_city);