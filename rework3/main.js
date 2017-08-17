/*
REQUIREMENTS FOR SPAWN : 
    FIRST SOURCE HAS 3 BLOCKS FOR HARVESTING
    3 BLOCK RADIUS AROUND SPAWN (4 blocks required for the top of spawn)
    PLACE SPAWN NEAR ROOM CONTROLLER FOR MAX EFFICENCY

COLORS :
    - YELLOW : HARVESTING
    - MAGENTA : DROPPING
    - BLUE : UPGRADING
    - CYAN : BUILDERS UPGRADING
    - RED : PAVERS MOVING
    - ORANGE : DEFENDERS MOVING
    - LIGHTER ORANGE : MINER MOVING
    - WHITE : MOVING
    - GREEN : getEnergy()
    - PURPLE : PAVER MOVING
FLAGS :
    - 'Harvesters' : harvester/hauler rally point
    - 'Pavers' : paver/repairer rally point
    - 'Defenders' : defenders rally point
TO DO LIST :
    - EXPAND TO ROOM NORTH OF CURRENT BASE FOR HYDROGEN
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
    var constructs = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);
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
    //console.log(buildable);
    //console.log(containers.length);
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
            stage4();
            break;
        case 5:
            stage5();
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
        checkPair();
        // TOWER
        tower(0);
        //CONSTRUCTION 
        if(Game.rooms[roomName].controller.level >= 2) {
            Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y+1, STRUCTURE_EXTENSION); // spawns at bottom of spawn
            Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y+2, STRUCTURE_EXTENSION); // spawns at bottom-2 from spawn
        } 
        // PROGRESSION CHECKER
        if(harvesters.length >= 0 && builders.length >= 3 && upgraders.length >= 1 && Memory.stage == 0 && extensions.length >= 2 && Game.rooms[roomName].controller.level >= 2 && Memory.containersDone[0]) {
            Memory.stage++;
        }
        else {
            if((Game.time%modTime)==1) {
                report(0,1);   
            }
        }
    };
    // STAGE 1 - get two pairs up 
    function stage1() {
        // HARVESTERS
        if(harvesters.length < 1) { // if harvesters less than 2, make more
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
        checkPair();
        // TOWER
        tower(0);
        
        //CONSTRUCTION 
        Game.rooms[roomName].createConstructionSite(spawnPos.x-1, spawnPos.y+2, STRUCTURE_EXTENSION); // spawns at left of petal center
        Game.rooms[roomName].createConstructionSite(spawnPos.x+1, spawnPos.y+2, STRUCTURE_EXTENSION); // spawns at right of petal center
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y+3, STRUCTURE_EXTENSION); // spawns at bottom of petal center
        //checkMaxEnergy(); // dont use it until stage 2
        
        // PROGRESSION CHECKER
        if(harvesters.length >= 1 && builders.length >= 4 && upgraders.length >= 1 && repairers.length >= 1 && Memory.stage == 1 && extensions.length >= 5 && Game.rooms[roomName].controller.level >= 2 && Memory.containersDone[0] && Memory.pairActive) { //&& Game.spawns['Spawn1'].room.energyAvailable >= 150
            Memory.stage++;
        }
        else {
            if((Game.time%modTime)==1) {
                report(1,2);
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
        else if(builders.length < 2 && constructs.length <= 4) { // if harvesters less than 2, make more
            spawn.run('builder2');
        }
        else if(builders.length < 6 && constructs.length > 4) { // if harvesters less than 2, make more
            spawn.run('builder2');
        }
        // UPGRADERS
        else if(upgraders.length < 1) { // if harvesters less than 2, make more
            spawn.run('upgrader2');
        }
        // REPAIRERS
        else if(repairers.length < 2) { // if harvesters less than 2, make more
            spawn.run('repairer4');
        }
        // PAVERS
        else if(pavers.length < 1) { // if harvesters less than 2, make more
            spawn.run('paver4');
        }
        // MINER / HAULER
        checkPair();
        // TOWER
        tower(0);
        //CONSTRUCTION 
        
        //checkMaxEnergy();
        // PROGRESSION CHECKER
        if(harvesters.length >= 1 && ((builders.length >= 2 && constructs.length <= 4) || (builders.length >= 6 && constructs.length > 4)) && upgraders.length >= 1 && repairers.length >= 1 && pavers.length >= 1 && Memory.stage == 2 && extensions.length >= 5 && Game.rooms[roomName].controller.level >= 3 && Memory.containersDone[1] && Memory.pairActive) {
            Memory.stage++;
        }
        else {
            if((Game.time%modTime)==1) {
                report(2,3);
            }
        }
    };
    // STAGE 3 - RCL is 3, defenses/roads can be developed
    function stage3() { 
        // HARVESTERS
        if(harvesters.length < 1) { // if harvesters less than 2, make more
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
        // REPAIRERS
        else if(repairers.length < 2) { // if harvesters less than 2, make more
            spawn.run('repairer4');
        }
        // PAVERS
        else if(pavers.length < 1) { // if harvesters less than 2, make more
            spawn.run('paver4');
        }
        // DEFENDERS
        else if(defenders.length < 1) { // if harvesters less than 2, make more
            spawn.run('defender4');
        }
        // TOWER
        tower(0); // function that runs the tower
        // MINER / HAULER
        checkPair();
        
        //CONSTRUCTION 
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y-2, STRUCTURE_TOWER); // spawns at top+2 of spawn
        Game.rooms[roomName].createConstructionSite(spawnPos.x-1, spawnPos.y-2, STRUCTURE_EXTENSION); // spawns at top+2 left of spawn
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y-1, STRUCTURE_EXTENSION); // spawns at top+1 of spawn
        Game.rooms[roomName].createConstructionSite(spawnPos.x+1, spawnPos.y-2, STRUCTURE_EXTENSION); // spawns at top+2 right of spawn
        Game.rooms[roomName].createConstructionSite(spawnPos.x-1, spawnPos.y, STRUCTURE_EXTENSION); // spawns at left of spawn
        Game.rooms[roomName].createConstructionSite(spawnPos.x+1, spawnPos.y, STRUCTURE_EXTENSION); // spawns at right of spawn
        
        //checkMaxEnergy();
        // PROGRESSION CHECKER
        if(harvesters.length >= 1 && builders.length >= 4 && upgraders.length >= 1 && repairers.length >= 1 && pavers.length >= 1 && defenders.length >= 1 && Memory.stage == 3 && extensions.length >= 10 && Game.rooms[roomName].controller.level >= 3 && Memory.containersDone[1] && Memory.pairActive) {
            Memory.stage++;
        }
        else {
            if((Game.time%modTime)==1) {
                report(3,4);
            }
        }
    };
    // STAGE 4 - RCL is 3, building up to RCL 4
    function stage4() { 
        // HARVESTERS
        if(harvesters.length < 1) { // if harvesters less than 2, make more
            spawn.run('harvester4');
        }
        // BUILDERS
        else if(builders.length < 2) { // if harvesters less than 2, make more
            spawn.run('builder4');
        }
        // UPGRADERS
        else if(upgraders.length < 4) { // if harvesters less than 2, make more
            spawn.run('upgrader4');
        }
        // REPAIRERS
        else if(repairers.length < 2) { // if harvesters less than 2, make more
            spawn.run('repairer4');
        }
        // PAVERS
        else if(pavers.length < 1) { // if harvesters less than 2, make more
            spawn.run('paver4');
        }
        // DEFENDERS
        else if(defenders.length < 2) { // if harvesters less than 2, make more
            spawn.run('defender4');
        }
        // TOWER
        tower(0); // function that runs the tower
        // MINER / HAULER
        checkPair();
        /*
        if(checkSource(5) && Game.spawns['Spawn1'].room.energyAvailable >= 550){ // ensures that only big combos will be spawned
            spawnPair(5);
        }; */
        
        //CONSTRUCTION 
        
        //checkMaxEnergy();
        // PROGRESSION CHECKER
        if(harvesters.length >= 1 && builders.length >= 2 && upgraders.length >= 4 && repairers.length >= 2 && pavers.length >= 1 && defenders.length >= 2 && Memory.stage == 4 && extensions.length >= 10 && Game.rooms[roomName].controller.level >= 4 && Memory.containersDone[1] && Memory.pairActive) {
            Memory.stage++;
        }
        else {
            if((Game.time%modTime)==1) {
                report(4,5);
            }
        }
    };
    // STAGE 5 - RCL is 4, building exts upto 20
    function stage5() { 
        // HARVESTERS
        if(harvesters.length < 1) { // if harvesters less than 2, make more
            spawn.run('harvester5');
        }
        // BUILDERS
        else if(builders.length < 4) { // if harvesters less than 2, make more
            spawn.run('builder5');
        }
        // UPGRADERS
        else if(upgraders.length < 2) { // if harvesters less than 2, make more
            spawn.run('upgrader5');
        }
        // REPAIRERS
        else if(repairers.length < 4) { // if harvesters less than 2, make more
            spawn.run('repairer5');
        }
        // PAVERS
        else if(pavers.length < 2) { // if harvesters less than 2, make more
            spawn.run('paver4');
        }
        // DEFENDERS
        else if(defenders.length < 4) { // if harvesters less than 2, make more
            spawn.run('defender4');
        }
        // TOWER
        tower(0); // function that runs the tower
        // MINER / HAULER
        checkPair();
        //spawnPair(2); can't do this bc they dont have anywhere to go... solution? add a second property to the function that tells them which source to go to instead of defaulting to 0
        
        // CONSTRUCTION 
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y-3, STRUCTURE_EXTENSION); // spawns at top+3 of spawn
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y-4, STRUCTURE_EXTENSION); // spawns at top+4 of spawn
        // LEFT PETAL
        Game.rooms[roomName].createConstructionSite(spawnPos.x-2, spawnPos.y, STRUCTURE_EXTENSION); // center
        Game.rooms[roomName].createConstructionSite(spawnPos.x-3, spawnPos.y, STRUCTURE_EXTENSION); // left
        Game.rooms[roomName].createConstructionSite(spawnPos.x-2, spawnPos.y-1, STRUCTURE_EXTENSION); // upper
        Game.rooms[roomName].createConstructionSite(spawnPos.x-2, spawnPos.y+1, STRUCTURE_EXTENSION); // lower
        // RIGHT PETAL
        Game.rooms[roomName].createConstructionSite(spawnPos.x+2, spawnPos.y, STRUCTURE_EXTENSION); // center
        Game.rooms[roomName].createConstructionSite(spawnPos.x+3, spawnPos.y, STRUCTURE_EXTENSION); // right
        Game.rooms[roomName].createConstructionSite(spawnPos.x+2, spawnPos.y-1, STRUCTURE_EXTENSION); // upper
        Game.rooms[roomName].createConstructionSite(spawnPos.x+2, spawnPos.y+1, STRUCTURE_EXTENSION); // lower
        
        // PROGRESSION CHECKER
        if(harvesters.length >= 1 && builders.length >= 4 && upgraders.length >= 2 && repairers.length >= 4 && pavers.length >= 2 && defenders.length >= 4 && Memory.stage == 5 && extensions.length >= 20 && Game.rooms[roomName].controller.level >= 4 && Memory.containersDone[1] && Memory.pairActive) {
            Memory.stage++;
        }
        else {
            if((Game.time%modTime)==1) {
                report(5,6);
            }
        }
    };
    
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
    function checkPair() { // run this to spawn pairs
        if(Memory.containersDone[0] && !Memory.pairActive) {
            spawnPair(0); // IM BROKEN TOO PLEASE FIX ME 
        };
        if(checkSource(1) && Game.spawns['Spawn1'].room.energyAvailable >= 200){
            spawnPair(1);
        };
        if(checkSource(2) && Game.spawns['Spawn1'].room.energyAvailable >= 350){ 
            spawnPair(2);
        };
        if(checkSource(3) && Game.spawns['Spawn1'].room.energyAvailable >= 550){ // ensures that only big combos will be spawned
            spawnPair(3);
        };
        if(checkSource(4) && Game.spawns['Spawn1'].room.energyAvailable >= 650){ // ensures that only big combos will be spawned
            spawnPair(4);
        };
    }
    // CHECKS HOW MANY IF SOURCENUM IS VALID - implement function that looks at how many var buildable there is and spawn accordingly
    function checkSource(sourceNum){
        let targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) /* &&
                        structure.store[RESOURCE_ENERGY] < structure.storeCapacity */;
            }});
        if(targets[sourceNum]){
            return true;
        };
        if(!targets[sourceNum]){
            return false;
        };
    };
    // CONTAINER BUILDER
    function buildContainers(sourceNum){
        let sources = Game.rooms[roomName].find(FIND_SOURCES);
        let aroundSources = {
            pos1: {x: sources[sourceNum].pos.x-1, y: sources[sourceNum].pos.y-1, wall: false}, // top left
            pos2: {x: sources[sourceNum].pos.x, y: sources[sourceNum].pos.y-1, wall: false}, // top middle
            pos3: {x: sources[sourceNum].pos.x+1, y: sources[sourceNum].pos.y-1, wall: false}, // top right
            pos4: {x: sources[sourceNum].pos.x-1, y: sources[sourceNum].pos.y, wall: false}, // left
            pos5: {x: sources[sourceNum].pos.x+1, y: sources[sourceNum].pos.y, wall: false}, // right
            pos6: {x: sources[sourceNum].pos.x-1, y: sources[sourceNum].pos.y+1, wall: false}, // bottom left
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
            }
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
    function tower(num) {
        // TOWER
        let tower = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER);}});
        if(tower.length > 0) {
            var closestDamagedStructure = tower[num].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => !(structure.structureType == STRUCTURE_WALL) && structure.hits < structure.hitsMax
            });
            if(closestDamagedStructure) {
                tower[num].repair(closestDamagedStructure);
            }

            var closestHostile = tower[num].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower[num].attack(closestHostile);
            }
            //console.log(closestDamagedStructure + closestHostile);
        };
        
    };
    // REPORTING FUNCTION 
    function report(current, prog){
        console.log('Current stage: ' + current + ' => Progress to stage ' + prog +  ': Harvesters: ' + harvesters.length + ' Builders: ' + builders.length + ' Upgraders: ' + upgraders.length + ' Repairers: ' + repairers.length + ' Pavers: ' + pavers.length + ' Defenders: ' + defenders.length + ' Extensions: ' + extensions.length + ' Energy: ' + Game.spawns['Spawn1'].room.energyAvailable);
    }

}
