// HARVESTS ENERGY FROM SOURCE AND DROPS AT SPAWN
var next = 0; // for sources
var roleHarvester = {
    // write if dropping full then move next to spawn
    
    /** @param {Creep} creep **/
    run: function(creep) {
        var buildRoad = require('function.buildRoad');
        buildRoad.buildRoad(creep);
        // ENERGY HARVESTING
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            const path = creep.pos.findPathTo(sources[next]);
            const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(target) {
                if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
                };
            };
            if(next > sources.length) {
                next = 0;
            }
            if(creep.harvest(sources[next]) == ERR_NOT_IN_RANGE) {
                if(!creep.fatigue){
                    creep.moveTo(sources[next], {visualizePathStyle: {stroke: '#ffaa00'}});
                    //creep.moveTo(path[next].x, path[next].y, {visualizePathStyle: {stroke: '#ffaa00'}});
                };
            }
            else if(creep.harvest(sources[next]) == ERR_NOT_ENOUGH_RESOURCES) {
                next++;
            };
        };
        //==========================================================================================================================================================
        // ENERGY DROPPING LOOP
        if(creep.carry.energy == creep.carryCapacity) { // if creep is full, then start dropping loop
            creep.memory.dropping = true;
        }
        else if(creep.carry.energy == 0) { // makes sure creep has 0 energy before harvesting again
            creep.memory.dropping = false;
        };
        if(creep.memory.dropping == true) { // remains true until creep has 0 energy left 
            dropEnergy();
        };
        //==========================================================================================================================================================
        function dropEnergy(){ // fix so that it dums ALL energy
            var int = 0; // for structures
            
            const targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
            }});
            //creep.say("Dropping!")
            
            if(creep.transfer(targets[int], RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
                if(!creep.fatigue){
                    creep.moveTo(targets[int],{visualizePathStyle: {stroke: '#ff6699'}});
                };
            }
            //var creepers= creep.transfer(targets[int], RESOURCE_ENERGY);
            //console.log(creepers);
            if(creep.transfer(targets[int], RESOURCE_ENERGY)==-7){ // if full 
                if(creep.moveTo(Game.flags['Harvesters']) != 0) {
                    if(!creep.fatigue){
                        creep.moveTo(Game.spawns['Spawn1'].pos.x+2,Game.spawns['Spawn1'].pos.y); 
                    };
                }
                //console.log('int: ' + int);
                if(int <= targets.length){
                    int++;
                }
                else if(int > targets.length){
                    int = 0;
                }
            };
        };
        
    }
    
};

module.exports = roleHarvester;