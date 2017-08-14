/*
REQUIREMENTS FOR SPAWN : 
    FIRST SOURCE HAS 3 BLOCKS FOR HARVESTING
    3 BLOCK RADIUS AROUND SPAWN
    PLACE SPAWN NEAR ROOM CONTROLLER FOR MAX EFFICENCY

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
FLAGS :
    - 'Harvesters' : harvester/hauler rally point
    - 'Pavers' : paver/repairer rally point
TO DO LIST :
    - REDO HARVESTING ARCHITECHTURE
        - MINER w/ min carry/max work => ENERGY_CARRIER w/ max carry/move => STORAGE where everyone else grabs energy from
    - CREATE SEPERATE SPAWNING SCRIPT AS FUNCTION=>RETURN NAME
    - Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE,MOVE], undefined, {role: 'paver'});
*/
/*
REWORK 2.0 :
    - establish infastructure for bee-lining RCL3
      - stage 0 : 2 harvester, 2 builder, 1 upgrader, get to 2 extensions
      - stage 1 : 4 better harvester, 2 better builder, 3 better upgrader, get to 5 extensions
      - stage 2 : 2 3work2carry1move harvester, 2 better builder, 2 better upgrader, get to RCL3

    - bee-line RCL3
      - stage 3 : 2 upgraded harvesters, 3 better builder, 1 better upgrader, get 8 extensions, roads
      - stage 4 : 2 upgraded harvesters, 2 better builder, 1 better upgrader, defenses
    - build roads + DEFENSES
REWORK 3.0 :
    - rework mining, utilize logistics asap 
        - stage 0 : 1 specialized builder sits next to container and builds it 
*/
/*
OCCUPIED CONSTRUCTION SITES :
    0 = free
    x = occupied
    T = tower
    S = Spawn1
    
    
    1.  1   2   3   4   5   6   7 
    2.  0   0   0   x   0   0   0
    2.  0   0   x   T   x   0   0 
    3.  x   0   0   0   0   0   0 
    4.  x   0   0   S   0   0   0 
    5.  x   0   0   x   0   0   0
    6.  0   0   x   x   x   0   0
    8.  0   0   0   x   0   0   0   
    9.  0   0   0   0   0   0   0
    
*/
/*
table of functions :
Game.rooms[roomName].createConstructionSite(spawnPos.x-1, spawnPos.y+2, STRUCTURE_EXTENSION); // spawns at left of petal center
Game.spawns['Spawn1'].room.energyAvailable >= 300
Game.rooms[roomName].controller.level >= 3
// REPAIRERS
        else if(repairers.length < 1) { // if harvesters less than 2, make more
            spawn.run('repairer4');
        }
&& repairers.length >= 1 
*/
var spawn = require('function.spawn');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDefender = require('role.defender');
var rolePaver = require('role.paver');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleRepairer = require('role.repairer');

Memory.stage = 0; // stage
Memory.signed = false; // signed with message
Memory.specialBuilder = true; // checks if builder can use source[0]

Memory.pairActive = false; // checks if miner/haulers are up

// CONTAINERS
Memory.builtContainers = [false,false,false]; // check if construction sites for containers are down
Memory.containersDone = [false,false,false]; // check if containers are built

var modTime = 10; //delay between each message
var buildable = 0;

module.exports.loop = function () {
    // clears memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('   Clearing non-existing creep memory: '+ name + ', who was a ');
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
    //console.log(buildable);

    // CLASS TRACKER
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    var pavers = _.filter(Game.creeps, (creep) => creep.memory.role == 'paver');
    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');

    // VARS
    const spawnPos = Game.spawns['Spawn1'].pos;
    var extensions = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
    var containers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }});
    //console.log(containers.length);
    
    // CONTAINER BUILDER
    if(Game.rooms[roomName].controller.level >= 1 && !Memory.builtContainers[0]) {
        buildContainers(0); //build containers at source 0
    }; 
    if(Memory.builtContainers[0] && (containers.length >= buildable)){ // BROKEN PLEASE FIX ME
        Memory.containersDone[0] = true;
        Memory.specialBuilder = false;
    };
    
    if(Memory.containersDone[0] && !Memory.builtContainers[1]) {
        buildContainers(1); //build containers at source 1 - use pairs 3/4 to access
    }; 
    if(Memory.builtContainers[1] && (containers.length >= buildable)){ // BROKEN PLEASE FIX ME
        Memory.containersDone[1] = true;
        Memory.specialBuilder = false;
    };
    
    //Memory.specialBuilder = false;
    
    // SWITCH CASE
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
            //stage4();
            break;
        case 5:
            //stage5();
            break;
    };
    // STAGES FUNCTIONS
    // STAGE 0 - Build container ASAP
    function stage0() {
        // HARVESTERS
        if(harvesters.length < 1 && builders.length < 3) { // if harvesters less than 2, make more
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
        
        // MINER / HAULER
        if(Memory.containersDone[0] && !Memory.pairActive) {
            spawnPair(0); // IM BROKEN TOO PLEASE FIX ME 
        }
        //CONSTRUCTION 
        if(Game.rooms[roomName].controller.level >= 2) {
            Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y+1, STRUCTURE_EXTENSION); // spawns at bottom of spawn
            Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y+2, STRUCTURE_EXTENSION); // spawns at bottom-2 from spawn
        } 
        // PROGRESSION CHECKER
        if(harvesters.length >= 0 && builders.length >= 3 && upgraders.length >= 1 && Memory.stage == 0 && extensions.length >= 2 && Game.rooms[roomName].controller.level >= 2 && Memory.containersDone[0]) {
            Memory.stage++;
            if((Game.time%modTime)==1) {
            }
        }
        else {
            if((Game.time%modTime)==1) {
                console.log("Progress to Memory.stage 1: Harvesters: " + harvesters.length + " Builders: " + builders.length + " Upgraders: " + upgraders.length);
            }
        }
    };
    // STAGE 1 - get two pairs up 
    function stage1() {
        // HARVESTERS
        if(harvesters.length < 2) { // if harvesters less than 2, make more
            spawn.run('harvester1');
        }
        // BUILDERS
        else if(builders.length < 4) { // if harvesters less than 2, make more
            spawn.run('builder1');
        }
        // UPGRADERS
        else if(upgraders.length < 1) { // if harvesters less than 2, make more
            spawn.run('upgrader1');
        }
        // REPAIRERS
        else if(repairers.length < 1) { // if harvesters less than 2, make more
            spawn.run('repairer4');
        }
        // MINER / HAULER
        spawnPair(1);
        
        //CONSTRUCTION 
        Game.rooms[roomName].createConstructionSite(spawnPos.x-1, spawnPos.y+2, STRUCTURE_EXTENSION); // spawns at left of petal center
        Game.rooms[roomName].createConstructionSite(spawnPos.x+1, spawnPos.y+2, STRUCTURE_EXTENSION); // spawns at right of petal center
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y+3, STRUCTURE_EXTENSION); // spawns at bottom of petal center
        checkMaxEnergy(); // dont use it until stage 2
        
        // PROGRESSION CHECKER
        if(harvesters.length >= 1 && builders.length >= 4 && upgraders.length >= 1 && repairers.length >= 1 && Memory.stage == 1 && extensions.length >= 5 && Game.rooms[roomName].controller.level >= 2 && Game.spawns['Spawn1'].room.energyAvailable >= 150 && Memory.containersDone[1] && Memory.pairActive) {
            Memory.stage++;
            if((Game.time%modTime)==1) {
            }
        }
        else {
            if((Game.time%modTime)==1) {
                console.log("Progress to Memory.stage 2: Harvesters: " + harvesters.length + " Builders: " + builders.length + " Upgraders: " + upgraders.length + " Repairers: " + repairers.length);
            }
        }
    };
    // STAGE 2 - has 5ext, get to RCL3
    function stage2() { 
        // HARVESTERS
        if(harvesters.length < 1) { // if harvesters less than 2, make more
            spawn.run('harvester2');
        }
        // BUILDERS
        else if(builders.length < 8) { // if harvesters less than 2, make more
            spawn.run('builder2');
        }
        // UPGRADERS
        else if(upgraders.length < 1) { // if harvesters less than 2, make more
            spawn.run('upgrader2');
        }
        // REPAIRERS
        else if(repairers.length < 1) { // if harvesters less than 2, make more
            spawn.run('repairer4');
        }
        // PAVERS
        else if(pavers.length < 1) { // if harvesters less than 2, make more
            spawn.run('paver4');
        }
        // MINER / HAULER
        spawnPair(2); //can't do this bc they dont have anywhere to go... solution? add a second property to the function that tells them which source to go to instead of defaulting to 0
        spawnPair(3);
        //CONSTRUCTION 
        
        checkMaxEnergy();
        // PROGRESSION CHECKER
        if(harvesters.length >= 1 && builders.length >= 8 && upgraders.length >= 1 && repairers.length >= 1 && pavers.length >= 1 && Memory.stage == 2 && extensions.length >= 5 && Game.rooms[roomName].controller.level >= 3 && Memory.containersDone[0] && Memory.pairActive) {
            Memory.stage++;
            if((Game.time%modTime)==1) {
            }
        }
        else {
            if((Game.time%modTime)==1) {
                console.log("Progress to Memory.stage 3: Harvesters: " + harvesters.length + " Builders: " + builders.length + " Upgraders: " + upgraders.length + " Repairers: " + repairers.length + " Pavers: " + pavers.length);
            }
        }
    };
    // STAGE 3 - ROADS
    function stage3() { 
        // HARVESTERS
        if(harvesters.length < 1) { // if harvesters less than 2, make more
            spawn.run('harvester3');
        }
        // BUILDERS
        else if(builders.length < 8) { // if harvesters less than 2, make more
            spawn.run('builder3');
        }
        // UPGRADERS
        else if(upgraders.length < 1) { // if harvesters less than 2, make more
            spawn.run('upgrader3');
        }
        // REPAIRERS
        else if(repairers.length < 1) { // if harvesters less than 2, make more
            spawn.run('repairer4');
        }
        // PAVERS
        else if(pavers.length < 1) { // if harvesters less than 2, make more
            spawn.run('paver4');
        }
        // MINER / HAULER
        //spawnPair(2); can't do this bc they dont have anywhere to go... solution? add a second property to the function that tells them which source to go to instead of defaulting to 0
        
        //CONSTRUCTION 
        Game.rooms[roomName].createConstructionSite(spawnPos.x-1, spawnPos.y-2, STRUCTURE_EXTENSION); // spawns at top+2 left of spawn
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y-1, STRUCTURE_EXTENSION); // spawns at top+3 of spawn
        Game.rooms[roomName].createConstructionSite(spawnPos.x+1, spawnPos.y-2, STRUCTURE_EXTENSION); // spawns at top+2 right of spawn
        checkMaxEnergy();
        // PROGRESSION CHECKER
        if(harvesters.length >= 1 && builders.length >= 8 && upgraders.length >= 1 && repairers.length >= 1 && pavers.length >= 1 && Memory.stage == 3 && extensions.length >= 8 && Game.rooms[roomName].controller.level >= 3 && Memory.containersDone[0] && Memory.pairActive) {
            Memory.stage++;
            if((Game.time%modTime)==1) {
            }
        }
        else {
            if((Game.time%modTime)==1) {
                console.log("Progress to Memory.stage 4: Harvesters: " + harvesters.length + " Builders: " + builders.length + " Upgraders: " + upgraders.length + " Repairers: " + repairers.length + " Pavers: " + pavers.length);
            }
        }
    };
    /*
    if(Game.rooms[roomName].controller.level >= 2) {
        
        
        
        
        
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y+1, STRUCTURE_EXTENSION); // spawns at bottom of spawn
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y+2, STRUCTURE_EXTENSION); // spawns at bottom-2 from spawn
        // THESE TWO FIRST
        
        // THEN THESE
        Game.rooms[roomName].createConstructionSite(spawnPos.x-1, spawnPos.y+2, STRUCTURE_EXTENSION); // spawns at left of petal center
        Game.rooms[roomName].createConstructionSite(spawnPos.x+1, spawnPos.y+2, STRUCTURE_EXTENSION); // spawns at right of petal center
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y+3, STRUCTURE_EXTENSION); // spawns at bottom of petal center
    }; 
    if(Game.rooms[roomName].controller.level >= 3) {
        Game.rooms[roomName].createConstructionSite(spawnPos.x-1, spawnPos.y-2, STRUCTURE_EXTENSION); // spawns at top+2 left of spawn
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y-1, STRUCTURE_EXTENSION); // spawns at top+3 of spawn
        Game.rooms[roomName].createConstructionSite(spawnPos.x+1, spawnPos.y-2, STRUCTURE_EXTENSION); // spawns at top+2 right of spawn
    };
    */
    
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
        else if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        else if(creep.memory.role == 'hauler') {
            let sourceNumH = name
            sourceNumH = sourceNumH.replace('Hauler','');
            sourceNumH = sourceNumH.replace(/\s/g, '');
            //console.log(sourceNumH);
            roleHauler.run(creep, sourceNumH[0]);
        }
        else if(creep.memory.role == 'miner') {
            let sourceNum = name
            sourceNum = sourceNum.replace('Miner','');
            sourceNum = sourceNum.replace(/\s/g, '');
            //console.log(sourceNum);
            roleMiner.run(creep, sourceNum[0]);
        }
    };
    // MINER / HAULER - add if last num is 0 than go to source 0, if num == 1 then go to source 1
    function spawnPair(number){
        if(!Game.creeps['Miner'+number]){
            spawn.run('minerEnergy', 'Miner'+number);
        };
        if(!Game.creeps['Hauler'+number]){
            spawn.run('haulerEnergy', 'Hauler'+number);
        };
            
        if(Game.creeps['Miner'+number] && Game.creeps['Hauler'+number]){
            Memory.pairActive = true;
        }
        if (!Game.creeps['Miner'+number] || !Game.creeps['Hauler'+number]) {
            Memory.pairActive = false;;
        };
    };
    // CONTAINER BUILDER
    function buildContainers(sourceNum){
        let sources = Game.rooms[roomName].find(FIND_SOURCES);
        var aroundSources = {
            pos1: {x: sources[sourceNum].pos.x-1, y: sources[sourceNum].pos.y-1, wall: false}, // top ;eft
            pos2: {x: sources[sourceNum].pos.x, y: sources[sourceNum].pos.y-1, wall: false}, // top middle
            pos3: {x: sources[sourceNum].pos.x+1, y: sources[sourceNum].pos.y-1, wall: false}, // top right
            pos4: {x: sources[sourceNum].pos.x-1, y: sources[sourceNum].pos.y, wall: false}, // left
            pos5: {x: sources[sourceNum].pos.x+1, y: sources[sourceNum].pos.y, wall: false}, // right
            pos6: {x: sources[sourceNum].pos.x+1, y: sources[sourceNum].pos.y+1, wall: false}, // bottom left
            pos7: {x: sources[sourceNum].pos.x, y: sources[sourceNum].pos.y+1, wall: false}, // bottom middle
            pos8: {x: sources[sourceNum].pos.x+1, y: sources[sourceNum].pos.y+1, wall: false}, // bottom right
        }; 
        function checkBuildable(posIn){
            let looker = Game.rooms[roomName].lookForAt(LOOK_TERRAIN,posIn.x, posIn.y);
            if(looker[0] == 'wall') {
                posIn.wall = true;
                return true;
            }
            else {
                buildable++;
                return false;
            };
        }; 
        for(let z = 1; z < 9; z++){
            let str = ('pos' + z);
            //console.log(str);
            if(checkBuildable(aroundSources[str])==false && !Memory.builtContainers[sourceNum]){
                Game.rooms[roomName].createConstructionSite(aroundSources[str].x, aroundSources[str].y, STRUCTURE_CONTAINER);
            };
            if(containers.length >= buildable){
                Memory.builtContainers[sourceNum] = true;
            }
            else {
                Memory.builtContainers[sourceNum] = false;
            };
        };    
    };
    // MAX ENERGY BUILDER
    function checkMaxEnergy(){
        var inter = 0; // uses switch case in order to build more storage // ZERO IS NO STORAGE
        if(Game.spawns['Spawn1'].room.energyAvailable == Game.spawns['Spawn1'].room.energyCapacityAvailable){
            inter++;
        };
        switch(inter) {
            case 0:
                return('Storages not maxed!');
                break;
            case 1:
                Game.rooms[roomName].createConstructionSite(spawnPos.x-3, spawnPos.y-1, STRUCTURE_CONTAINER); // spawns at left-3 up-1
                break;
            case 2:
                Game.rooms[roomName].createConstructionSite(spawnPos.x-3, spawnPos.y, STRUCTURE_CONTAINER); // spawns at left-3 up-1
                break;
            case 3:
                Game.rooms[roomName].createConstructionSite(spawnPos.x-3, spawnPos.y+1, STRUCTURE_CONTAINER); // spawns at left-3 up-1
                break;
        };
        
    };
    // TOWER
    function tower() {
        // TOWER
        let tower = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER);}});
        if(tower) {
            let closestDamagedStructure = tower[0].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            if(closestDamagedStructure) {
                tower[0].repair(closestDamagedStructure);
            }

            let closestHostile = tower[0].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower[0].attack(closestHostile);
            }
        };    
    };

}
