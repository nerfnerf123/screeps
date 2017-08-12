var roleHarvester = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        var buildRoad = require('function.buildRoad');
        buildRoad.buildRoad(creep);
        
        var int = 0; // for structures
        var next = 0; // for sources

        function upgrade() {
            if(creep.memory.upgrading && creep.carry.energy == 0) {
                creep.memory.upgrading = false;
                creep.say('🔄 harvest');
            }   
            if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
                creep.memory.upgrading = true;
                creep.say('⚡ upgrade');
            }
            if(creep.memory.upgrading) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.say("🏃 moving");
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[2]) == ERR_NOT_IN_RANGE) {
                    creep.say("🏃 moving");
                    creep.moveTo(sources[2], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[next]) == ERR_NOT_IN_RANGE) {
                creep.say("🏃 moving");
                creep.moveTo(sources[next], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            else if(creep.harvest(sources[0]) == ERR_NOT_ENOUGH_RESOURCES) {
                next++;
                if(next > sources.length) {
                    next = 0;
                }
            }
        }
        if(creep.carry.energy == creep.carryCapacity) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }});
            creep.say("dropping!");
            creep.moveTo(targets[int], {visualizePathStyle: {stroke: '#ff6699'}});
            if(creep.transfer(targets[int],RESOURCE_ENERGY) == ERR_FULL) {
                console.log("STORAGE FULL! " + targets[int])
                int++;
                if(int > Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }})){
                    int = 0;
                }
            }
        }
    }
    
};

module.exports = roleHarvester;