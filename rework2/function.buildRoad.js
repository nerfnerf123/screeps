/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('function.buildRoad');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    buildRoad: function(creep){
        //console.log("IM WORKING!");
        var modTime = 5;
        if(Game.time%modTime==1){
            var roads = creep.pos.findInRange(FIND_STRUCTURES, 0, {filter: (s)=>s.structureType==STRUCTURE_ROAD}); // checks if there is a road where the creep is standing
            if(roads.length == 0 && Memory.stage>=3){ // if no roads (i.e 0) then make a construction site for a road
                creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD); // at the creep's position in it's room, create the road
            }
        }
    }
}