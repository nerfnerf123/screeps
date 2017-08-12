/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('function.spawn');
 * mod.thing == 'a thing'; // true
 */


var spawn = {
    
    
    run: function(creepRole) {
        switch(creepRole){
            // STAGE 0
            case 'harvester0':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'harvester'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new harvester: ' + newName);
                }
                break;
            case 'builder0':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new builder: ' + newName);
                }
                break;
            case 'upgrader0':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new upgrader: ' + newName);
                }
                break;
            // STAGE 2
            case 'harvester2':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'harvester'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new harvester: ' + newName);
                }
                break;
            case 'builder2':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,CARRY,MOVE], undefined, {role: 'builder'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new builder: ' + newName);
                }
                break;
            case 'upgrader2':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'upgrader'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new upgrader: ' + newName);
                }
                break;
            // STAGE 3
            case 'harvester3':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'harvester'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new harvester: ' + newName);
                }
                break;
            case 'builder3':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new builder: ' + newName);
                }
                break;
            case 'upgrader3':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'upgrader'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new upgrader: ' + newName);
                }
                break;
            case 'defender3':
                var newName = Game.spawns['Spawn1'].createCreep([ATTACK,TOUGH,TOUGH,MOVE,MOVE], undefined, {role: 'defender'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new defender: ' + newName);
                }
                break;
            // STAGE 4
            case 'harvester4':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'harvester'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new harvester: ' + newName);
                }
                break;
            case 'builder4':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new builder: ' + newName);
                }
                break;
            case 'upgrader4':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'upgrader'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new upgrader: ' + newName);
                }
                break;
            case 'defender4':
                var newName = Game.spawns['Spawn1'].createCreep([ATTACK,TOUGH,TOUGH,MOVE,MOVE], undefined, {role: 'defender'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new defender: ' + newName);
                }
                break;
            case 'paver4':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE,MOVE], undefined, {role: 'paver'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new paver: ' + newName);
                }
                break;
            // STAGE 5
            case 'harvester5':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'harvester'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new harvester: ' + newName);
                }
                break;
        }   
    }
}

module.exports = spawn;
