#!/usr/bin/env bash

rm -rf dist
mkdir dist

cp index.html dist
cp -rf js dist
cp -rf mocks dist
rsync -R node_modules/jquery/dist/jquery.min.js dist
rsync -R node_modules/heatmapjs/heatmap.min.js dist
rsync -R node_modules/gmaps-heatmap/gmaps-heatmap.js dist
