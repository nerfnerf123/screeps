var roleHarvester = {
    // write if dropping full then move next to spawn
    
    /** @param {Creep} creep **/
    run: function(creep) {
        var buildRoad = require('function.buildRoad');
        buildRoad.buildRoad(creep);
        
        
        var next = 0; // for sources

        function upgrade() {
            if(creep.memory.upgrading && creep.carry.energy == 0) {
                creep.memory.upgrading = false;
                //creep.say('🔄 harvest');
            }   
            if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
                creep.memory.upgrading = true;
                //creep.say('⚡ upgrade');
            }
            if(creep.memory.upgrading) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    //creep.say("🏃 moving");
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[2]) == ERR_NOT_IN_RANGE) {
                    //creep.say("🏃 moving");
                    creep.moveTo(sources[2], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[next]) == ERR_NOT_IN_RANGE) {
                //creep.say("🏃 moving");
                creep.moveTo(sources[next], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            else if(creep.harvest(sources[0]) == ERR_NOT_ENOUGH_RESOURCES) {
                next++;
                if(next > sources.length) {
                    next = 0;
                }
            }
        }
        // ENERGY DROPPING LOOP
        if(creep.carry.energy == creep.carryCapacity) { // if creep is full, then start dropping loop
            creep.memory.dropping = true;
        }
        else if(creep.carry.energy == 0) { // makes sure creep has 0 energy before harvesting again
            creep.memory.dropping = false;
        }
        if(creep.memory.dropping == true) { // remains true until creep has 0 energy left 
            dropEnergy();
        }
        
        /*
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
        */
        
        function dropEnergy(){ // fix so that it dums ALL energy
            var int = 0; // for structures
            const targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
            }});
            //creep.say("Dropping!")
            if(creep.transfer(targets[int], RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
                creep.moveTo(targets[int],{visualizePathStyle: {stroke: '#ff6699'}});
            }
            //var creepers= creep.transfer(targets[int], RESOURCE_ENERGY);
            //console.log(creepers);
            if(creep.transfer(targets[int], RESOURCE_ENERGY)==-7){ // if full 
                if(creep.moveTo(Game.flags['Harvesters']) != 0) {
                    creep.moveTo(Game.spawns['Spawn1'].pos.x+2,Game.spawns['Spawn1'].pos.y);
                }
                //console.log('int: ' + int);
                if(int <= targets.length){
                    int++;
                }
                else if(int > targets.length){
                    int = 0;
                }
            }
        }
        
    }
    
};

module.exports = roleHarvester;