
var roleBuilder = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        var buildRoad = require('function.buildRoad');
        buildRoad.buildRoad(creep);
        
        var int = 0;
        
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }
        
        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets == 0){
                creep.memory.building = false;
                creep.say('😴 IDLE')
                if(!creep.memory.building && creep.carry.energy > 0){
                    upgrade();
                    creep.say('⚡ upgrade');
                }
            }
            if((Game.time%150)==1) {
                console.log("Structure Queue: " + targets.length); 
            }
            
            if(creep.build(targets[int]) == ERR_NOT_IN_RANGE) {
                creep.say("🏃 moving");
                creep.moveTo(targets[int], {visualizePathStyle: {stroke: '#ffffff'}});
            }
            
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(sources.length > 1) {
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else {
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }    
        
        function upgrade() {
            if(creep.memory.upgrading && creep.carry.energy == 0) {
                creep.memory.upgrading = false;
                creep.say('🔄 harvest');
            }   
            if(!creep.memory.upgrading && creep.carry.energy > 0) {
                creep.memory.upgrading = true;
                creep.say('⚡ upgrade');
            }
            if(creep.memory.upgrading) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.say("🏃 moving");
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00FFD1'}});
                }
            }
            else {
                var sources = creep.room.find(FIND_SOURCES);
                if(sources.length > 1) {
                    if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
                else {
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
        }
    }
};

module.exports = roleBuilder;