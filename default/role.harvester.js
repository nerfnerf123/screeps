var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(sources.length > 1) {
                for(var energySource in sources) {
                    creep.harvest()
                    creep.say("Harvested!")
                    if(creep.harvest(sources[energySource]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[energySource], {visualizePathStyle: {stroke: '#F700FF'}});
                        //creep.say('MOVING TO: ' + sources[energySource])
                    }
                }
            }
            else {
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    creep.say("Dropping!")
                }
            }
        }
        //console.log('Harvesting!')
    }
};

module.exports = roleHarvester;