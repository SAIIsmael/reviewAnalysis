#!/bin/bash
mongoimport --db hotelreview --collection members --file members.json --jsonArray --drop
mongoimport --db hotelreview --collection reviews --file reviews.json --jsonArray --drop
mongoimport --db hotelreview --collection pro --file pro.json --jsonArray --drop
