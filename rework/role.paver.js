/*
// roomName
var roomName = Game.spawns['Spawn1'].room;
roomName = String(roomName);
roomName = roomName.replace('[room','');
roomName = roomName.replace(']','');
roomName = roomName.replace(/\s/g, '');
*/

var rolePaver = {
    run: function(creep) {
        var intWall = 0;
        //var walls = creep.room.find(FIND_STRUCTURES, {filter: (objects) => { return (structureType: STRUCTURE_WALL) && objects.hits < objects.hitsMax;}});
        var walls = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_WALL) && structure.hits < structure.hitsMax;
            }});
        //console.log(walls.length);
        if(walls.length > 0){
            /*
            var closestDamagedStructure = creep.room.find(FIND_STRUCTURES, {
                filter: (object) => { structureType: STRUCTURE_WALL && object.hits < object.hitsMax; }
            });
            */
            //console.log("closestDamagedStructure " + walls[intWall]);
            
            if(walls) {
                //var job = creep.repair(walls[intWall]);
                //console.log(job);
                //console.log('Walls.hit: ' + walls[intWall].hits)
                if(walls[intWall].hits >= 1000) { // walls[intWall].hitsMax*0.0001){ // goes to 300 right now q
                    intWall++;
                }
                creep.say("🛠️ repair");
                new RoomVisual ('WIN1').circle(walls[intWall], {fill: '#0CFF00', radius: 1, stroke: 'red'});
                /*
                if(creep.repair(walls[intWall])==ERR_INVALID_TARGET){
                    creep.say("INVALID");
                */
                if(creep.repair(walls[intWall])==ERR_NOT_IN_RANGE){
                    creep.say("🏃 moving");
                    creep.moveTo(walls[intWall], {visualizePathStyle: {stroke:'#9900cc'}});
                }
                if(creep.repair(walls[intWall])==ERR_NOT_ENOUGH_RESOURCES){ // REPLACE THIS WITH GOING TO A CONTAINER AND HARVESTING
                    getEnergy();
                }
                
            }
        }
        else{
            creep.say("NO WALLS");
            creep.moveTo(Game.spawns['Spawn1'].pos.x+2,creep.room.spawn['Spawn1'].pos.y+2);
        }
        
        function getEnergy(){ // fix at 49 energy
            var int = 0;
            var targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy == structure.energyCapacity;
            }});
            
            if(targets.length > 0 && Memory.stage==4){ // only starts using energy from spawn at stage 4 
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
            else if(targets.length==0 || Memory.stage!=4){
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