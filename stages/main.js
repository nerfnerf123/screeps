/*
COLORS :
    - YELLOW : HARVESTING
    - MAGENTA : DROPPING
    - BLUE : UPGRADING
    - CYAN : BUILDERS UPGRADING
    - RED : PAVERS MOVING
    - ORANGE : DEFENDERS MOVING
    - WHITE : MOVING
    
TO DO LIST :
    - REDO HARVESTING ARCHITECHTURE
        - MINER w/ min carry/max work => ENERGY_CARRIER w/ max carry/move => STORAGE where everyone else grabs energy from 
    - CREATE SEPERATE SPAWNING SCRIPT AS FUNCTION=>RETURN NAME
    - Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE,MOVE], undefined, {role: 'paver'});
*/
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDefender = require('role.defender');
var rolePaver = require('role.paver');

var stage = 0;
Memory.signed = false;

var modTime = 50; //delay between each message

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
    //console.log("Stage: " + stage)
    //console.log("ROOM: " + Game.roomName)
    //console.log(Game.rooms[roomName].controller.level);
    
    
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
    
    switch(stage) {
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
    }
    
    // STAGE 0 : STARTER
    function stage0() {
        // HARVESTERS
        if(harvesters.length < 2) { // if harvesters less than 2, make more
            var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'harvester'});
            if(newName!=-6&&newName!=-4) {
                console.log('Spawning new harvester: ' + newName);
            }
        }
        // BUILDERS
        else if(builders.length < 1) { // if harvesters less than 2, make more
            var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
            if(newName!=-6&&newName!=-4) {
                console.log('Spawning new builder: ' + newName);
            }
        }
        // UPGRADERS
        else if(upgraders.length < 1) { // if harvesters less than 2, make more
            var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
            if(newName!=-6&&newName!=-4) {
                console.log('Spawning new upgrader: ' + newName);    
            }
        }
        // PROGRESSION CHECKER
        if(harvesters.length >= 2 && builders.length >= 1 && upgraders.length >= 1 && stage == 0 && Game.rooms[roomName].controller.level == 2) {
            stage++;
            if((Game.time%modTime)==1) {
            console.log('👍 UPGRADED TO STAGE 1');
            }
        }
        else {
            if((Game.time%modTime)==1) {
                console.log("Progress to stage 1: Harvesters: " + harvesters.length + " Builders: " + builders.length + " Upgraders: " + upgraders.length);
            }
        }
    }
    // STAGE 1 : BASIC
    function stage1() {
        // HARVESTERS
        if(harvesters.length < 2) { // if harvesters less than 2, make more
            var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'harvester'});
            if(newName!=-6&&newName!=-4) {
                console.log('Spawning new harvester: ' + newName);
            }
        }
        // BUILDERS
        else if(builders.length < 5) { // if harvesters less than 2, make more
            var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
            if(newName!=-6&&newName!=-4) {
                console.log('Spawning new builder: ' + newName);
            }
        }
        // UPGRADERS
        else if(upgraders.length < 1) { // if harvesters less than 2, make more
            var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
            if(newName!=-6&&newName!=-4) {
                console.log('Spawning new upgrader: ' + newName);    
            }
        }
        // CONSTRUCTION
        const spawnPos = Game.spawns['Spawn1'].pos;
        
        Game.rooms[roomName].createConstructionSite(spawnPos.x-1, spawnPos.y+1, STRUCTURE_EXTENSION); // spawns at bottom left
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y+1, STRUCTURE_EXTENSION); // spawns at bottom
        Game.rooms[roomName].createConstructionSite(spawnPos.x+1, spawnPos.y+1, STRUCTURE_EXTENSION); // spawns at bottom right
        Game.rooms[roomName].createConstructionSite(spawnPos.x-1, spawnPos.y, STRUCTURE_EXTENSION); // spawns at left
        Game.rooms[roomName].createConstructionSite(spawnPos.x+1, spawnPos.y, STRUCTURE_EXTENSION); // spawns at right
        
        // STRUCTURE CHECKER    
        const extensions = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
        // PROGRESSION CHECKER
        if(harvesters.length >= 2 && builders.length >= 5 && upgraders.length >= 1 && stage == 1 && extensions.length >= 2) {
            stage++;
            if((Game.time%modTime)==1) {
            console.log('👍 UPGRADED TO STAGE 2');
            }
        }
        
        else {
            if((Game.time%modTime)==1) {
                console.log("Progress to stage 2: Harvesters: " + harvesters.length + " Builders: " + builders.length + " Upgraders: " + upgraders.length + " Extensions: " + extensions.length);
            }
        }
    }
    // STAGE 2 : IMPROVEMENT
    function stage2() {
        // HARVESTERS
        if(harvesters.length < 4) { // if harvesters less than 2, make more
            var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,MOVE], undefined, {role: 'harvester'});
            if(newName!=-6&&newName!=-4) {
                console.log('Spawning new harvester: ' + newName);
            }
        }
        // BUILDERS
        else if(builders.length < 6) { // if harvesters less than 2, make more
            var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
            if(newName!=-6&&newName!=-4) {
                console.log('Spawning new builder: ' + newName);
            }
        }
        // UPGRADERS
        else if(upgraders.length < 2) { // if harvesters less than 2, make more
            var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'upgrader'});
            if(newName!=-6&&newName!=-4) {
                console.log('Spawning new upgrader: ' + newName);    
            }
        }
        // CONSTRUCTION
        const spawnPos = Game.spawns['Spawn1'].pos;
        //console.log("SpawnPos: " + spawnPos);
        // 0,0 is top left corner
      
        
        // STRUCTURE CHECKER    
        const extensions = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
        //console.log("Extensions: " + extensions.length);
        
        // PROGRESSION CHECKER
        if(harvesters.length >= 4 && builders.length >= 6 && upgraders.length >= 2 && stage == 2 && extensions.length >= 5) {
            stage++;
            if((Game.time%modTime)==1) {
            console.log('👍 UPGRADED TO STAGE 3');
            }
        }
        
        else {
            if((Game.time%modTime)==1) {
                console.log("Progress to stage 3: Harvesters: " + harvesters.length + " Builders: " + builders.length + " Upgraders: " + upgraders.length + " Extensions: " + extensions.length);
            }
        }
    }
    // STAGE 3 : DEFENSES // takes 8000 ticks
    function stage3() {
        // HARVESTERS
        if(harvesters.length < 7) { // if harvesters less than 2, make more
            var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE], undefined, {role: 'harvester'});
            if(newName!=-6&&newName!=-4) {
                console.log('Spawning new harvester: ' + newName);
            }
        }
        // BUILDERS
        else if(builders.length < 7) { // if harvesters less than 2, make more
            var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
            if(newName!=-6&&newName!=-4) {
                console.log('Spawning new builder: ' + newName);
            }
        }
        // UPGRADERS
        else if(upgraders.length < 2) { // if harvesters less than 2, make more
            var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'upgrader'});
            if(newName!=-6&&newName!=-4) {
                console.log('Spawning new upgrader: ' + newName);    
            }
        }
        // DEFENDERS
        else if(defenders.length < 2) { // if harvesters less than 2, make more
            var newName = Game.spawns['Spawn1'].createCreep([ATTACK,TOUGH,TOUGH,MOVE,MOVE,CARRY,WORK], undefined, {role: 'defender'});
            if(newName!=-6&&newName!=-4) {
                console.log('Spawning new defender: ' + newName);    
            }
        }
        // CONSTRUCTION
        const spawnPos = Game.spawns['Spawn1'].pos;
        //console.log("SpawnPos: " + spawnPos);
        // 0,0 is top left corner
      
        
        // STRUCTURE CHECKER    
        const extensions = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
        //console.log("Extensions: " + extensions.length);
        
        // PROGRESSION CHECKER
        if(harvesters.length >= 7 && builders.length >= 7 && upgraders.length >= 2 && defenders.length >= 2 && stage == 3) { //extensions.length >= 5
            stage++;
            if((Game.time%modTime)==1) {
            console.log('👍 UPGRADED TO STAGE 4');
            }
        }
        
        else {
            if((Game.time%modTime)==1) {
                console.log("Progress to stage 4: Harvesters: " + harvesters.length + " Builders: " + builders.length + " Upgraders: " + upgraders.length + " Defenders: " + defenders.length + " Extensions: " + extensions.length);
            }
        }
    }
    // STAGE 4 : ROADS
    function stage4() {
        // HARVESTERS
        if(harvesters.length < 8) { // if harvesters less than 2, make more
            var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE], undefined, {role: 'harvester'});
            if(newName!=-6&&newName!=-4) {
                console.log('Spawning new harvester: ' + newName);
            }
        }
        // BUILDERS
        else if(builders.length < 9) { // if harvesters less than 2, make more
            var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
            if(newName!=-6&&newName!=-4) {
                console.log('Spawning new builder: ' + newName);
            }
        }
        // UPGRADERS
        else if(upgraders.length < 3) { // if harvesters less than 2, make more
            var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'upgrader'});
            if(newName!=-6&&newName!=-4) {
                console.log('Spawning new upgrader: ' + newName);    
            }
        }
        // DEFENDERS
        else if(defenders.length < 4) { // if harvesters less than 2, make more
            var newName = Game.spawns['Spawn1'].createCreep([ATTACK,ATTACK,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,CARRY,WORK], undefined, {role: 'defender'});
            if(newName!=-6&&newName!=-4) {
                console.log('Spawning new defender: ' + newName);
            }
        }
        // PAVERS
        else if(pavers.length < 1) { // if harvesters less than 2, make more
            var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE,MOVE], undefined, {role: 'paver'});
            if(newName!=-6&&newName!=-4) {
                console.log('Spawning new paver: ' + newName);    
            }
        }
        
        // CONSTRUCTION
        const spawnPos = Game.spawns['Spawn1'].pos;
        //console.log("SpawnPos: " + spawnPos);
        // 0,0 is top left corner
      
        
        // STRUCTURE CHECKER    
        const extensions = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
        //console.log("Extensions: " + extensions.length);
        
        // PROGRESSION CHECKER
        if(harvesters.length >= 8 && builders.length >= 9 && upgraders.length >= 3 && defenders.length >= 4 && pavers.length >= 1 && stage == 4 && Game.rooms[roomName].controller.level == 3) { //extensions.length >= 5
            stage++;
            if((Game.time%modTime)==1) {
            console.log('👍 UPGRADED TO STAGE 5');
            }
        }
        
        else {
            if((Game.time%modTime)==1) {
                console.log("Progress to stage 5: Harvesters: " + harvesters.length + " Builders: " + builders.length + " Upgraders: " + upgraders.length + " Defenders: " + defenders.length + " Pavers " + pavers.length + " Extensions: " + extensions.length);
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
