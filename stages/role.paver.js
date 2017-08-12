/*
// roomName
var roomName = Game.spawns['Spawn1'].room;
roomName = String(roomName);
roomName = roomName.replace('[room','');
roomName = roomName.replace(']','');
roomName = roomName.replace(/\s/g, '');
*/

var rolePaver = {
    run: function(creep) {
        var roads = creep.room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_ROAD }});
        if(roads){
            var closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            if(closestDamagedStructure) {
                creep.say("🛠️ repair");
                if(creep.repair(closestDamagedStructure)==ERR_NOT_IN_RANGE){
                    creep.moveTo(closestDamagedStucture);
                }
                else if(creep.repair(closestDamagedStructure)==ERR_NOT_ENOUGH_RESOURCES){ // REPLACE THIS WITH GOING TO A CONTAINER AND HARVESTING
                    var sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.say("🏃 moving");
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
                
            }
        }
        else{
            creep.say("NO ROADS");
        }
        
        
    }
}; 

module.exports = rolePaver;