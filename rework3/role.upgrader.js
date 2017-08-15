var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var buildRoad = require('function.buildRoad');
        //buildRoad.buildRoad(creep);
        
        if(Memory.signed == false) {
            if(creep.signController(creep.room.controller, "New player - please don't hurt me!") == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
                Memory.signed = true;
            }
        }
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
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#0027FF'}});
            }
        }
        else {
            creep.say('energy');
            getEnergy();
        }
        /*
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(sources.length > 1) {
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.say("🏃 moving");
                    creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else {
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.say("🏃 moving");
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
        */
        function getEnergy(){ // fix at 49 energy
            var int = 0;
            var targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy >= structure.energyCapacity*0.8;
            }});
            
            if(targets.length > 0){ // only starts using energy from spawn at stage 1 //&& creep.room.energyAvailable >= 400
                creep.say('🔄getEnergy');
                if(creep.withdraw(targets[int], RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
                    creep.moveTo(targets[int], {visualizePathStyle: {stroke: '#0CFF00'}});
                }
                if(creep.withdraw(targets[int], RESOURCE_ENERGY)==ERR_NOT_ENOUGH_RESOURCES){
                    if(int <= targets.length){
                        int++;
                    }
                    else if(int > targets.length){
                        int = 0;
                    }
                }
            }
            else if(targets.length==0){ //|| creep.room.energyAvailable < 400
                creep.say('🔄 harvest');
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    //creep.say("🏃 moving");
                    creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        };  
    }
};

module.exports = roleUpgrader;