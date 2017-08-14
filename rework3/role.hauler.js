// HAULS ENERGY FROM CONTAINER TO SPAWN
var roleHauler = {
    run: function(creep, source) {
        if(creep.memory.supplying && creep.carry.energy == 0) { 
            creep.memory.supplying = false; 
            creep.say('fetching'); 
        }
        if(!creep.memory.supplying && creep.carry.energy == creep.carryCapacity) { 
            creep.memory.supplying = true; 
            creep.say('supplying'); 
        }
        if (creep.memory.supplying) { 
            /*
            let stores = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
            }});
            if (stores && stores.length > 0) { 
                if(creep.transfer(stores[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { 
                    creep.moveTo(stores[0]); 
                }
            }
            */
            dropEnergy();
        }
        else { 
            let containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.store[RESOURCE_ENERGY] > 0;
            }});
            //let source = creep.pos.findClosestByPath(containers); 
            //console.log('Containers: ' + containers + ' Sources: ' + source);
            if (!containers) { // || !source
                creep.say('NO TARGET');
            }
            /*
            else if (source[source]) { 
                if(creep.withdraw(source[source], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { 
                    creep.moveTo(source[source]); 
                }
            }
            */
            else if (containers[source]) { 
                if(creep.withdraw(containers[source], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { 
                    creep.moveTo(containers[source]); 
                }
            }
            
        };
        function dropEnergy(){ // fix so that it dums ALL energy
            var int = 0; // for structures
            
            const targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER ||  structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
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
        };
    }
}
    
module.exports = roleHauler;