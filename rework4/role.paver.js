// FIXES WALLS - STUCK IN GET ENERGY LOOP
var intWall = 0;
var rolePaver = {
    run: function(creep) {
        
        //var walls = creep.room.find(FIND_STRUCTURES, {filter: (objects) => { return (structureType: STRUCTURE_WALL) && objects.hits < objects.hitsMax;}});
        var walls = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) && structure.hits < structure.hitsMax*0.001 ; //structure.hitsMax 300,000
            }});
        //console.log(walls.length);
        if(intWall > walls.length) {
            intWall = 0;
        }
        if(creep.memory.repairing && creep.carry.energy == 0){ // REPLACE THIS WITH GOING TO A CONTAINER AND HARVESTING
            creep.memory.repairing = false; 
        }
        
        if(walls.length > 0 && !creep.memory.repairing && (creep.carry.energy == creep.carryCapacity)){
            creep.memory.repairing = true; 
        }
        if(walls.length == 0){
            creep.memory.repairing = false;
            creep.say("NO WALLS");
            if(creep.moveTo(Game.flags['Pavers']) != 0) {
                creep.moveTo(Game.spawns['Spawn1'].pos.x-2,Game.spawns['Spawn1'].pos.y-2);
            };
        }
        if(creep.memory.repairing){
            if(walls[intWall].hits >= 300000) { // walls[intWall].hitsMax*0.0001){ // goes to 300 right now q
                intWall++;
                //console.log(intWall);
            } 
            if(creep.repair(walls[intWall])==ERR_NOT_IN_RANGE){
                creep.moveTo(walls[intWall], {visualizePathStyle: {stroke:'#9900cc'}});
            }
        }
        else if (creep.carry.energy == 0){
            getEnergy();
        };
        //==========================================================================================================================================================
        
        //==========================================================================================================================================================
        function getEnergy(){ // fix at 49 energy
            var int = 0;
            var targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy >= structure.energyCapacity*0.5;
            }});
            
            if(targets.length > 0){ // only starts using energy from spawn at stage 4 
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
            else if(targets.length==0){
                creep.say('🔄 harvest');
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.say("🏃 moving");
                    creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
}; 

module.exports = rolePaver;