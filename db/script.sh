#!/bin/bash
mongoimport --db hotereview --collection members --file members.json --jsonArray --drop
