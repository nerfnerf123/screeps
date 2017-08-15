// TARGETS HOSTILE CREEPS
var roleDefender = {
    run: function(creep) {
        const spawnPos = Game.spawns['Spawn1'].pos;
        // FIGHTING
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                //creep.say("🏃 moving");
                creep.moveTo(target, {visualizePathStyle: {stroke: '#FF8000'}});
            }
        }
        if(!target){
            creep.say("NO TARGETS")
            if(creep.moveTo(Game.flags['Defenders']) != 0) {
                    creep.moveTo(Game.spawns['Spawn1'].pos.x+4,Game.spawns['Spawn1'].pos.y+4);
                }
        }
        if(creep.hits<=creep.hitsMax*0.5){
            console.log(creep + "HP " + creep.hits);
        }  
        
    }
}; 

module.exports = roleDefender;