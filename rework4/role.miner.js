// MINES SOURCE INTO CONTAINER
// needs something to build the container and to transport 
// when using the role definer, make sure to tell which source it is going to

var roleMiner = {
    run: function(creep, source) {
        let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
            }});
        //console.log(targets.length);
        if(targets.length > 0) {
            if(creep.pos.getRangeTo(targets[source]) == 0) {
                let source = creep.pos.findClosestByPath(FIND_SOURCES);
                creep.harvest(source);
            }
            else {
                creep.moveTo(targets[source],{visualizePathStyle: {stroke: '#ff6a00'}});
            }
        }
    }
    
    
}

module.exports = roleMiner;