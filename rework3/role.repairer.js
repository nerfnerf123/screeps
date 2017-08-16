// FIXES CONTAINERS AND ROADS
var roleRepairer = {
    run: function(creep) {
        var int = 0;
        var repairs = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_ROAD) && structure.hits < structure.hitsMax*0.9;}});
        
        if(repairs.length == 0){
            creep.memory.repairing = false;
            creep.say("NO REPAIRS");
            if(creep.moveTo(Game.flags['Pavers']) != 0) {
                creep.moveTo(Game.spawns['Spawn1'].pos.x-2,Game.spawns['Spawn1'].pos.y-1);
            };
        }
        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
        }
        else if(!creep.memory.repairing && (creep.carry.energy == creep.carryCapacity) && repairs.length > 0 ) {
            creep.memory.repairing = true;
        }
        else if(creep.memory.repairing) {
            if(repairs.length > 0 && (Game.time%150)==1) {
                console.log("Repair Queue: " + repairs.length); 
            }
            if(creep.repair(repairs[int]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(repairs[int], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else if (creep.carry.energy != creep.carryCapacity) {
            getEnergy();
        };
        function getEnergy(){ 
            let int = 0;
            let targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        
                        if ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy >= structure.energyCapacity*0.6) { //&& creep.room.controller.level < 3
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy >= structure.energyCapacity*0.6;
                        }
                        if ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] >= structure.storeCapacity*0.4) {
                            return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] >= structure.storeCapacity*0.4;
                        }; 
                        
                        //return (((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy >= structure.energyCapacity*0.6) && (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] >= structure.storeCapacity*0.4);
                        /*
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy >= structure.energyCapacity*0.6 ; // if we use *0.9 harvesters still can't replenish quickly enough
                        */
                        
                    }        
            });
            
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

module.exports = roleRepairer;