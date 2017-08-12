/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('report');
 * mod.thing == 'a thing'; // true
 */
var main = require('main');

module.exports = function(main){
    console.log("Harvesters: " + main.harvesters.length + " Builders: " + main.builders.length + " Upgraders: " + main.upgraders.length + " Defenders: " + main.defenders.length + " Pavers " + main.pavers.length + " Extensions: " + main.extensions.length);
};