#!/bin/bash

sudo service postgresql start

echo CREATE DATABASE "tavindo" | psql
echo \\password "postgres" | psql