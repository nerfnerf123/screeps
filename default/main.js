//Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'})

/*
TO DO LIST : 
- move all repair code to role.builder
- upgrade controller
- auto-build roads
- defenses
- utilize stage aka
    stage 1 :  2 harvest, 1 build
    stage 2 : 6 harvest, 4 build, 2 upgrade
    stage 3 : 12 harvest, 6 build, 4 upgrade, 4 attack
    stage 4 : 20 harvest, 10 build, 6 upgrade, 12 attack
    stage 5 : 32 harvest, 12 build, 8 upgrade, 16 attack, 4 tower
    stage 6: 12 upgraded harvest, 4 upgraded build, 2 upgraded upgrade, 6 upgraded attack, 4 tower
- make sure to spawn better

COLORS : 
MAGENTA : Array harvesting
YELLOW : Harvesting
WHITE : Upgrading

*/

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    console.log('Starting at tick: ' + Game.time);
    
    // SPAWNING CODE
    
    // - HARVESTERS
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 8) { // if harvesters less than 2, make more
        var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    }
    // - BUILDER
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('Builders: ' + builders.length);

    if(builders.length < 4) { // if harvesters less than 2, make more
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
        console.log('Spawning new builder: ' + newName);
    }
    // - UPGRADER
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Upgraders: ' + upgraders.length);

    if(upgraders.length < 2) { // if harvesters less than 2, make more
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + newName);
    }
    
    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Memory.creeps) { // if creep doesnt exist, delete their memory
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

// SPAWNING POSITIONING

    if(Game.spawns['Spawn1'].spawning) { // if creep is spawning, position them to the right and align
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            'Constructing: ' + spawningCreep.memory.role, // says out loud "constructing"
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

// ASSIGNING ROLE

    for(var name in Game.creeps) { // goes through every creep, reads their role, then runs according script via import
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}