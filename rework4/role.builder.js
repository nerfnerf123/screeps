// USES ENERGY FROM SOURCE/SPAWN TO BUILD STUFF AND REPAIR
var roleBuilder = {
    // build functiton that determinds all of the possible stages where it can and cannot use spawn energy
    /** @param {Creep} creep **/
    run: function(creep) {
        var levelTooLow = false;
        var int = 0;
        var constructs = creep.room.find(FIND_CONSTRUCTION_SITES);
        //==========================================================================================================================================================
        if(constructs.length == 0){
            creep.memory.building = false;
            creep.memory.upgrading = true;
            /*
            if(creep.moveTo(Game.flags['Builders']) != 0) {
                if(!creep.fatigue){
                    creep.moveTo(Game.spawns['Spawn1'].pos.x-3,Game.spawns['Spawn1'].pos.y-1); 
                };
            };
            */
        }
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if(!creep.memory.building && (creep.carry.energy == creep.carryCapacity) && constructs.length > 0 ) {
            creep.memory.building = true;
        }
        if(creep.memory.building) {
            if(constructs.length > 0 && (Game.time%150)==1) {
                console.log("Structure Queue: " + constructs.length); 
            }
            if(creep.build(constructs[int]) == ERR_NOT_IN_RANGE) {
                if(!creep.fatigue){
                    creep.moveTo(constructs[int], {visualizePathStyle: {stroke: '#ffffff'}});
                };
            }
            else if(creep.build(constructs[int]) == -14) {
                console.log('RCL is not high enough!');
                levelTooLow = true;
            };
        }
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                if(!creep.fatigue){
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#0027FF'}});
                }
            };
        }
        /*
        if(levelTooLow){
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                if(!creep.fatigue){
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#0027FF'}});
                }
            };
        }
        */
        else if (!creep.memory.building){
            getEnergy();
        };
        //==========================================================================================================================================================
       
        //==========================================================================================================================================================
        function getEnergy(){ // ADAPT TO NEW LOGISTICS SYSTEM
            var int = 0;
            var targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        /*
                        if ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy >= structure.energyCapacity*0.6) { //&& creep.room.controller.level < 3
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy >= structure.energyCapacity*0.6;
                        }
                        */
                        if ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] >= structure.storeCapacity*0.4) {
                            return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] >= structure.storeCapacity*0.4;
                        }; 
                    }        
            });
            
            if(targets.length > 0 && (!Memory.specialBuilder || Memory.pairActive) && Game.spawns['Spawn1'].room.energyAvailable >= 300){ // only starts using energy from spawn at stage 4 - needs this inorder to allow stage 3 creeps to spawn 
                if(creep.withdraw(targets[int], RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
                    if(!creep.fatigue){
                        creep.moveTo(targets[int], {visualizePathStyle: {stroke: '#0CFF00'}});
                    };
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
            else if(Memory.specialBuilder){
                //creep.say('🔄 harvest');
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    if(!creep.fatigue){
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});    
                    };
                };
            }
            else if(targets.length==0){
                //creep.say('🔄 harvest');
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    if(!creep.fatigue){
                        creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});    
                    };
                };
            };
        };  
    }
};

module.exports = roleBuilder;