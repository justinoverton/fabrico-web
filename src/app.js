const fabrico = require('fabrico');
const fantasy = require('fabrico/dist/fantasy.js');

exports.fabrico = fabrico;

exports.fantasy = fantasy;
exports.maps = {
    terrainMap: require('./maps/terrainmap.js'),
    city: require('./maps/city.js')
};
