var getEnergy = require('function.getEnergy');

var roleBuilder = {
    // build functiton that determinds all of the possible stages where it can and cannot use spawn energy
    /** @param {Creep} creep **/
    run: function(creep) {
        var buildRoad = require('function.buildRoad');
        buildRoad.buildRoad(creep);
        
        var int = 0;
        var constructs = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(constructs.length == 0){
            creep.memory.building = false;
        }
        if(!creep.memory.building && constructs.length == 0){
            creep.memory.upgrading = true;
            //creep.say('⚡ upgrade');
            upgrade();
        }
        else if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            //creep.say('🔄 harvest');
            //creep.say("🌟 energy");
            getEnergy();
        }
        else if(!creep.memory.building && (creep.carry.energy == creep.carryCapacity) && constructs.length > 0 ) {
            creep.memory.upgrading = false;
            creep.memory.building = true;
            //creep.say('🚧 build');
        }
        else if(creep.memory.building) {
            if(constructs.length > 0 && (Game.time%150)==1) {
                console.log("Structure Queue: " + constructs.length); 
            }
            if(creep.build(constructs[int]) == ERR_NOT_IN_RANGE) {
                //creep.say("🏃 moving");
                creep.moveTo(constructs[int], {visualizePathStyle: {stroke: '#ffffff'}});
            }
            
            
        }
        else {
            getEnergy();
        }
        
    
        function upgrade() {
            //creep.say("🌟 energy");
            if(creep.memory.upgrading && creep.carry.energy == 0) {
                creep.memory.upgrading = false;
                //creep.say('🔄 harvest');
            }   
            if(!creep.memory.upgrading && creep.carry.energy == creep.carry.energyCapacity) {
                creep.memory.upgrading = true;
                //creep.say('⚡ upgrade');
            }
            if(creep.memory.upgrading) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    //creep.say("🏃 moving");
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00FFD1'}});
                }
            }
            
            else {
                getEnergy();
            }
            
        }
        function getEnergy(){ // fix at 49 energy
            if(creep.carry.energy == creep.carryCapacity){
                return 'full';
            }
            var int = 0;
            var targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy >= structure.energyCapacity*0.9; // if we use *0.9 harvesters still can't replenish quickly enough
            }});
            
            if((targets.length > 0 && creep.room.energyAvailable >= 500) || (Memory.stage == 0 && creep.room.energyAvalible >= 290)){ // only starts using energy from spawn at stage 4 - needs this inorder to allow stage 3 creeps to spawn
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
            else if(targets.length==0 || creep.room.energyAvailable < 500){
                creep.say('🔄 harvest');
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    //creep.say("🏃 moving");
                    creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            
        }  
    }
};

module.exports = roleBuilder;