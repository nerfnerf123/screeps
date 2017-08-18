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
    - 'Builders' : builder rally point
    - 'Pavers' : paver/repairer rally point
    - 'Defenders' : defenders rally point
TO DO LIST :
    - EXPAND TO ROOM NORTH OF CURRENT BASE FOR HYDROGEN
*/
/*
REWORK 4.0 : 
    - Utilize the least amount of creeps for the most amount of benefit
    - 1 high level miner/hauler per source
    - 1 high level harvester per room
    - 1 high level builder 
    - 1 high level upgrader
    - 1 high level repairer 
    - 1 high level paver -- combine with repairer or possibly builder
    
    if (!creep.fatige){

    creep.moveTo(xx,xx)

    };

    - first spawn a 300engy builder in order to get first container up asap, then spawn the miner/hauler
    - REWRITE ALL ENERGY USING CREEPS TO GRAB FROM CONTAINERS ONLY
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
//==========================================================================================================================================================
var spawn = require('function.spawn');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDefender = require('role.defender');
var rolePaver = require('role.paver');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleRepairer = require('role.repairer');


Memory.signed = false; // signed with message
Memory.specialBuilder = true; // checks if builder can use source[0]

Memory.pairActive = [false,false,false,false,false,false]; // checks if miner/haulers are up

// CONTAINERS
Memory.builtContainers = [false,false,false]; // check if construction sites for containers are down
Memory.containersDone = [false,false,false]; // check if containers are built

var buildable = 0;
var containerMax = 0;
//==========================================================================================================================================================
module.exports.loop = function () {
    // clears memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('   Clearing non-existing creep memory: '+ name + ', who was a ');
        }
    };

    // roomName
    var roomName = Game.spawns['Spawn1'].room;
    roomName = String(roomName);
    roomName = roomName.replace('[room','');
    roomName = roomName.replace(']','');
    roomName = roomName.replace(/\s/g, '');
    var homeRoom = roomName;
    
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
    var walls = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART)}});
    var constructs = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);
    
    //==========================================================================================================================================================
    // CONTAINER BUILDER
    if(Game.rooms[roomName].controller.level >= 1 && !Memory.builtContainers[0]) {
        buildContainers(0); //build containers at source 0
    }; 
    if(Memory.builtContainers[0] && (containers.length >= buildable)){ // waits until every container for that source is built before it declares done
        Memory.containersDone[0] = true;
        Memory.specialBuilder = false;
    };
    // fix this bc container limit is 5
    if(Memory.containersDone[0] && !Memory.builtContainers[1] && Game.rooms[roomName].controller.level >= 3 && buildable <= 5) {
        buildContainers(1); //build containers at source 1 - use pairs 3/4 to access
    }; 
    if(Memory.builtContainers[1] && (containers.length >= buildable)){ 
        Memory.containersDone[1] = true;
        Memory.specialBuilder = false;
    };
    
    //==========================================================================================================================================================
    // =HARVESTERS=
    if(harvesters.length < 1 && !Memory.pairActive[0] && Game.spawns['Spawn1'].room.energyAvailable <= 300) { 
        spawn.run('generalEnergy', 'harvester');
    };
    // =BUILDERS=
    if(builders.length < 1 && constructs.length > 1 && Game.spawns['Spawn1'].room.energyAvailable >= 300) { 
        spawn.run('generalEnergy', 'builder');
    }
    else if(Memory.specialBuilder && builders.length < 2 && Game.spawns['Spawn1'].room.energyAvailable >= 300) { 
        spawn.run('generalEnergy', 'builder');
    }
    else if(constructs.length > 8 && builders.length < 4 && Game.spawns['Spawn1'].room.energyAvailable >= 400) { 
        spawn.run('generalEnergy', 'builder');
    };
    // =UPGRADERS=
    if(upgraders.length < 1 && Game.spawns['Spawn1'].room.energyAvailable >= 300) { 
        spawn.run('generalEnergy', 'upgrader');
    }
    else if(upgraders.length < 4 && builders.length == 0 && Game.spawns['Spawn1'].room.energyAvailable >= 800){
        spawn.run('generalEnergy', 'upgrader');
    };
    // =REPAIRERS=
    if(repairers.length < 1 && !tower) { 
        spawn.run('generalEnergy', 'repairer');
    };
    // =PAVERS=
    if(pavers.length < 1 && walls.length > 1) {
        spawn.run('generalEnergy', 'paver');
    };
    // =MINER / HAULER=
    checkPair();
    // =TOWER=
    tower(0);
    //==========================================================================================================================================================
    //CONSTRUCTION -- REWORK FOR MORE EFFICENT COLLECTING/DROPPING, CONSIDER A 'U' SHAPE
    if(Game.rooms[roomName].controller.level >= 2 && extensions.length < 2) {
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y+1, STRUCTURE_EXTENSION); // spawns at bottom of spawn
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y+2, STRUCTURE_EXTENSION); // spawns at bottom-2 from spawn
    } 
    else if(extensions.length == 2) {
        Game.rooms[roomName].createConstructionSite(spawnPos.x-1, spawnPos.y+2, STRUCTURE_EXTENSION); // spawns at left of petal center
        Game.rooms[roomName].createConstructionSite(spawnPos.x+1, spawnPos.y+2, STRUCTURE_EXTENSION); // spawns at right of petal center
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y+3, STRUCTURE_EXTENSION); // spawns at bottom of petal center
    }
    else if(Game.rooms[roomName].controller.level >= 3 && extensions.length == 5) {
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y-2, STRUCTURE_TOWER); // spawns at top+2 of spawn
        Game.rooms[roomName].createConstructionSite(spawnPos.x-1, spawnPos.y-2, STRUCTURE_EXTENSION); // spawns at top+2 left of spawn
        Game.rooms[roomName].createConstructionSite(spawnPos.x, spawnPos.y-1, STRUCTURE_EXTENSION); // spawns at top+1 of spawn
        Game.rooms[roomName].createConstructionSite(spawnPos.x+1, spawnPos.y-2, STRUCTURE_EXTENSION); // spawns at top+2 right of spawn
        Game.rooms[roomName].createConstructionSite(spawnPos.x-1, spawnPos.y, STRUCTURE_EXTENSION); // spawns at left of spawn
        Game.rooms[roomName].createConstructionSite(spawnPos.x+1, spawnPos.y, STRUCTURE_EXTENSION); // spawns at right of spawn
    }
    else if(Game.rooms[roomName].controller.level >= 4 && extensions.length == 10) {
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
    }
    //==========================================================================================================================================================
    if((Game.time%10)==1) {
                report('REWOWRK4.0','REWORK4.0');   
    };
    //==========================================================================================================================================================
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
    //==========================================================================================================================================================
    // MINER / HAULER - add if last num is 0 than go to source 0, if num == 1 then go to source 1
    function spawnPair(number){
        if(!Game.creeps['Miner'+number]){
            spawn.run('minerEnergy', 'Miner'+number);
        };
        if(!Game.creeps['Hauler'+number]){
            spawn.run('haulerEnergy', 'Hauler'+number);
        };
            
        if(Game.creeps['Miner'+number] && Game.creeps['Hauler'+number]){
            Memory.pairActive[number] = true;
        }
        if (!Game.creeps['Miner'+number] || !Game.creeps['Hauler'+number]) {
            Memory.pairActive[number] = false;;
        };
    };
    function checkPair() { // run this to spawn pairs
        if(Memory.containersDone[0] && !Memory.pairActive[0]) {
            spawnPair(0); // IM BROKEN TOO PLEASE FIX ME 
        };
        if(Memory.containersDone[0] && checkSource(1) && Game.spawns['Spawn1'].room.energyAvailable >= 300){
            spawnPair(1);
        };
        if(Memory.containersDone[0] && checkSource(2) && Game.spawns['Spawn1'].room.energyAvailable >= 400){ 
            spawnPair(2);
        };
        if(Memory.containersDone[1] && checkSource(3) && Game.spawns['Spawn1'].room.energyAvailable >= 600){ 
            spawnPair(3);
        };
        if(Memory.containersDone[1] && checkSource(4) && Game.spawns['Spawn1'].room.energyAvailable >= 800){ 
            spawnPair(4);
        };
    };
    //==========================================================================================================================================================
    // CHECKS HOW MANY IF SOURCENUM IS VALID - implement function that looks at how many var buildable there is and spawn accordingly
    function checkSource(conNum){ // conNum is number of container
        let targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) /* &&
                        structure.store[RESOURCE_ENERGY] < structure.storeCapacity */;
            }});
        if(targets[conNum]){
            return true;
        };
        if(!targets[conNum]){
            return false;
        };
    };
    // CONTAINER BUILDER
    function buildContainers(sourceNum){ // source num is which energy source
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
        function checkContainerMax(){
            for(let type in constructs){
                if(type.structureType == STRUCTURE_CONTAINER){
                    containerMax++;
                    return containerMax;
                };
            };
        };
        for(let z = 1; z < 9; z++){
            let str = ('pos' + z);
            if(checkBuildable(aroundSources[str])==false && !Memory.builtContainers[sourceNum] && buildable <= 5){
                Game.rooms[roomName].createConstructionSite(aroundSources[str].x, aroundSources[str].y, STRUCTURE_CONTAINER);
            }
            if(containers.length >= buildable){ // || (!Memory.pairActive[0] && containers.length == 1) // waits until every container for that source is built before it is true
                Memory.builtContainers[sourceNum] = true;
            }
            else {
                Memory.builtContainers[sourceNum] = false;
            };
        };    
    };
    //console.log(containers.length + ' ' + buildable);
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
        var tower = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
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
        console.log('\n\n\n');
        console.log('===========================-REPORT-===========================');
        console.log('Current game time: ' + Game.time);
        console.log('Harvesters: ' + harvesters.length + ' Builders: ' + builders.length + ' Upgraders: ' + upgraders.length + ' Repairers: ' + repairers.length + ' Pavers: ' + pavers.length + ' Defenders: ' + defenders.length + ' Extensions: ' + extensions.length + ' Energy: ' + Game.spawns['Spawn1'].room.energyAvailable);
        console.log('Containers done: ' + Memory.containersDone);
        console.log('Pairs active: ' + Memory.pairActive);
        console.log('==============================================================\n\n\n');
    };

}
