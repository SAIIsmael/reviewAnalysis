#!/bin/bash
mongoimport --db hotereview --collection members --file members.json --jsonArray --drop
mongoimport --db hotereview --collection reviews --file reviews.json --jsonArray --drop
