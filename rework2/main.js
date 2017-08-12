/*
COLORS :
    - YELLOW : HARVESTING
    - MAGENTA : DROPPING
    - BLUE : UPGRADING
    - CYAN : BUILDERS UPGRADING
    - RED : PAVERS MOVING
    - ORANGE : DEFENDERS MOVING
    - WHITE : MOVING
    - GREEN : getEnergy()
    - PURPLE : PAVER MOVING
TO DO LIST :
    - REDO HARVESTING ARCHITECHTURE
        - MINER w/ min carry/max work => ENERGY_CARRIER w/ max carry/move => STORAGE where everyone else grabs energy from
    - CREATE SEPERATE SPAWNING SCRIPT AS FUNCTION=>RETURN NAME
    - Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE,MOVE], undefined, {role: 'paver'});
*/
var spawn = require('function.spawn');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDefender = require('role.defender');
var rolePaver = require('role.paver');

Memory.stage = 0;
Memory.signed = false;

var modTime = 10; //delay between each message

module.exports.loop = function () {
    // clears memory
    for(var name in Memory.creeps) {
        //console.log(Game.creeps[name].memory.role);
        //var creepRole = Game.creeps[name].memory.role;
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory: '+ name + ', who was a ');
        }
    }

    // roomName
    var roomName = Game.spawns['Spawn1'].room;
    roomName = String(roomName);
    roomName = roomName.replace('[room','');
    roomName = roomName.replace(']','');
    roomName = roomName.replace(/\s/g, '');

    // DEBUGGING
    //console.log("Stage: " + Memory.stage)
    //console.log("ROOM: " + Game.roomName)
    //console.log(Game.rooms[roomName].controller.level);
    //spawn.run('harvester');

    // CLASS TRACKER
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    //console.log('Harvesters: ' + harvesters.length);
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    //console.log('Builders: ' + builders.length);
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    //console.log('Upgraders: ' + upgraders.length);
    var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    //console.log('Defenders: ' + defenders.length);
    var pavers = _.filter(Game.creeps, (creep) => creep.memory.role == 'paver');
    //console.log('Pavers: ' + pavers.length);

    // VARS
    const spawnPos = Game.spawns['Spawn1'].pos;
    var extensions = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});

    switch(Memory.stage) {
        case 0:
            stage0();
            break;
        case 1:
            stage1();
            break;
        case 2:
            stage2();
            break;
        case 3:
            stage3();
            break;
        case 4:
            stage4();
            break;
        case 5:
            stage5();
            break;
    }

    // STAGE 0 : STARTER
    function stage0() {
        // HARVESTERS
        if(harvesters.length < 2) { // if harvesters less than 2, make more
            spawn.run('harvester0');
        }
        // BUILDERS
        else if(builders.length < 1) { // if harvesters less than 2, make more
            spawn.run('builder0');
        }
        // UPGRADERS
        else if(upgraders.length < 1) { // if harvesters less than 2, make more
            spawn.run('upgrader0');
        }
        // PROGRESSION CHECKER
        if(harvesters.length >= 2 && builders.length >= 1 && upgraders.length >= 1 && Memory.stage == 0 && Game.rooms[roomName].controller.level >= 2) {
            Memory.stage++;
            if((Game.time%modTime)==1) {
            //console.log('👍 UPGRADED TO STAGE 1');
            }
        }
        else {
            if((Game.time%modTime)==1) {
                console.log("Progress to Memory.stage 1: Harvesters: " + harvesters.length + " Builders: " + builders.length + " Upgraders: " + upgraders.length);
            }
        }
    }
    // STAGE 1 : BASIC
    function stage1() {
        // HARVESTERS
        if(harvesters.length < 3) { // if harvesters less than 2, make more
            spawn.run('harvester0');
        }
        // BUILDERS
        else if(builders.length < 3) { // if harvesters less than 2, make more
            spawn.run('builder0');
        }
        // UPGRADERS
        else if(upgraders.length < 1) { // if harvesters less than 2, make more
            spawn.run('upgrader0');
        }
        // CONSTRUCTION
        Game.rooms[roomName].createConstructionSite(spawnPos.x-1, spawnPos.y+1, STRUCTURE_EXTENSION); // spawns at bottom left
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y+1, STRUCTURE_EXTENSION); // spawns at bottom


        // STRUCTURE CHECKER

        // PROGRESSION CHECKER
        if(harvesters.length >= 3 && builders.length >= 3 && upgraders.length >= 1 && extensions.length >= 2 && Memory.stage == 1) {
            Memory.stage++;
            if((Game.time%modTime)==1) {
            //console.log('👍 UPGRADED TO STAGE 2');
            }
        }

        else {
            if((Game.time%modTime)==1) {
                console.log("Progress to Memory.stage 2: Harvesters: " + harvesters.length + " Builders: " + builders.length + " Upgraders: " + upgraders.length + " Extensions: " + extensions.length);
            }
        }
    }
    // STAGE 2 : IMPROVEMENT
    function stage2() {
        // HARVESTERS
        if(harvesters.length < 3) { // if harvesters less than 2, make more
            spawn.run('harvester2');
        }
        // BUILDERS
        else if(builders.length < 4) { // if harvesters less than 2, make more
            spawn.run('builder2');
        }
        // UPGRADERS
        else if(upgraders.length < 1) { // if harvesters less than 2, make more
            spawn.run('upgrader2');
        }
        // CONSTRUCTION

        //console.log("SpawnPos: " + spawnPos);
        // 0,0 is top left corner
        Game.rooms[roomName].createConstructionSite(spawnPos.x+1, spawnPos.y+1, STRUCTURE_EXTENSION); // spawns at bottom right
        Game.rooms[roomName].createConstructionSite(spawnPos.x-1, spawnPos.y, STRUCTURE_EXTENSION); // spawns at left
        Game.rooms[roomName].createConstructionSite(spawnPos.x+1, spawnPos.y, STRUCTURE_EXTENSION); // spawns at right

        // STRUCTURE CHECKER

        //console.log("Extensions: " + extensions.length);

        // PROGRESSION CHECKER
        if(harvesters.length >= 3 && builders.length >= 4 && upgraders.length >= 1 && extensions.length >= 5 && Memory.stage == 2) {
            Memory.stage++;
            if((Game.time%modTime)==1) {
            //console.log('👍 UPGRADED TO STAGE 3');
            }
        }

        else {
            if((Game.time%modTime)==1) {
                console.log("Progress to Memory.stage 3: Harvesters: " + harvesters.length + " Builders: " + builders.length + " Upgraders: " + upgraders.length + " Extensions: " + extensions.length);
            }
        }
    }
    // STAGE 3 : DEFENSES // takes 8000 ticks
    function stage3() {
        // HARVESTERS
        if(harvesters.length < 4) { // if harvesters less than 2, make more
            spawn.run('harvester3');
        }
        // BUILDERS
        else if(builders.length < 4) { // if harvesters less than 2, make more
            spawn.run('builder3');
        }
        // UPGRADERS
        else if(upgraders.length < 1) { // if harvesters less than 2, make more
            spawn.run('upgrader3');
        }
        // DEFENDERS
        else if(defenders.length < 1) { // if harvesters less than 2, make more
            spawn.run('defender3');
        }
        // CONSTRUCTION
        // 0,0 is top left corner

        // PROGRESSION CHECKER
        if(harvesters.length >= 4 && builders.length >= 4 && upgraders.length >= 1 && defenders.length >= 1 && Memory.stage == 3) { //extensions.length >= 5
            Memory.stage++;
            if((Game.time%modTime)==1) {
            //console.log('👍 UPGRADED TO STAGE 4');
            }
        }

        else {
            if((Game.time%modTime)==1) {
                console.log("Progress to Memory.stage 4: Harvesters: " + harvesters.length + " Builders: " + builders.length + " Upgraders: " + upgraders.length + " Defenders: " + defenders.length + " Extensions: " + extensions.length);
            }
        }
    }
    // STAGE 4 : ROADS
    function stage4() {
        // HARVESTERS
        if(harvesters.length < 4) { // if harvesters less than 2, make more
            spawn.run('harvester4');
        }
        // BUILDERS
        else if(builders.length < 4) { // if harvesters less than 2, make more
            spawn.run('builder4');
        }
        // UPGRADERS
        else if(upgraders.length < 2) { // if harvesters less than 2, make more
            spawn.run('upgrader4');
        }
        // DEFENDERS
        else if(defenders.length < 2) { // if harvesters less than 2, make more
            spawn.run('defender4');
        }
        // PAVERS
        else if(pavers.length < 1) { // if harvesters less than 2, make more
            spawn.run('paver4');
        }

        // CONSTRUCTION
        //console.log("SpawnPos: " + spawnPos);
        // 0,0 is top left corner

        // PROGRESSION CHECKER
        if(harvesters.length >= 4 && builders.length >= 4 && upgraders.length >= 2 && defenders.length >= 2 && pavers.length >= 1 && Memory.stage == 4 && Game.rooms[roomName].controller.level >= 3) { //extensions.length >= 5
            Memory.stage++;
            if((Game.time%modTime)==1) {
            //console.log('👍 UPGRADED TO STAGE 5');
            }
        }

        else {
            if((Game.time%modTime)==1) {
                console.log("Progress to Memory.stage 5: Harvesters: " + harvesters.length + " Builders: " + builders.length + " Upgraders: " + upgraders.length + " Defenders: " + defenders.length + " Pavers: " + pavers.length + " Extensions: " + extensions.length);
            }
        }
    }
    // STAGE 5 : ENERGY STORAGE
    function stage5() {
        // HARVESTERS
        if(harvesters.length < 4) { // if harvesters less than 2, make more
            spawn.run('harvester5');
        }
        // BUILDERS
        else if(builders.length < 4) { // if harvesters less than 2, make more
            spawn.run('builder4');
        }
        // UPGRADERS
        else if(upgraders.length < 2) { // if harvesters less than 2, make more
            spawn.run('upgrader4');
        }
        // DEFENDERS
        else if(defenders.length < 4) { // if harvesters less than 2, make more
            spawn.run('defender4');
        }
        // PAVERS
        else if(pavers.length < 1) { // if harvesters less than 2, make more
            spawn.run('paver4');
        }

        // CONSTRUCTION
        //console.log("SpawnPos: " + spawnPos);
        // 0,0 is top left corner
        Game.rooms[roomName].createConstructionSite(spawnPos.x-1, spawnPos.y-2, STRUCTURE_EXTENSION); // spawns at top+1 left
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y-2, STRUCTURE_EXTENSION); // spawns at top+1
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y-2, STRUCTURE_EXTENSION); // spawns at top+1 right

        // PROGRESSION CHECKER
        if(harvesters.length >= 4 && builders.length >= 4 && upgraders.length >= 2 && defenders.length >= 4 && pavers.length >= 1 && Memory.stage == 5 && Game.rooms[roomName].controller.level >= 3) { //extensions.length >= 5
            Memory.stage++;
            if((Game.time%modTime)==1) {
            //console.log('👍 UPGRADED TO STAGE 6');
            }
        }

        else {
            if((Game.time%modTime)==1) {
                console.log("Progress to Memory.stage 6: Harvesters: " + harvesters.length + " Builders: " + builders.length + " Upgraders: " + upgraders.length + " Defenders: " + defenders.length + " Pavers " + pavers.length + " Extensions: " + extensions.length);
            }
        }
    }

    // ASSIGNS ROLES
    for(var name in Game.creeps) { // goes through every creep, reads their role, then runs according script via import
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if(creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
        else if(creep.memory.role == 'paver') {
            rolePaver.run(creep);
        }
    }


}
