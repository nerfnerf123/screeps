// SPAWNS CREEP USING SWITCH CASE
var spawn = {

    run: function(creepRole, name) {
        switch(creepRole){
            // STAGE 0 : 0exts
            case 'harvester0':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,MOVE], name, {role: 'harvester'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new harvester: ' + newName);
                }
                break;
            case 'builder0':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], name, {role: 'builder'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new builder: ' + newName);
                }
                break;
            case 'upgrader0':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,MOVE], name, {role: 'upgrader'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new upgrader: ' + newName);
                }
                break;
            // STAGE 1 : 2exts
            case 'harvester1':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,MOVE], name, {role: 'harvester'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new harvester: ' + newName);
                }
                break;
            case 'builder1':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], name, {role: 'builder'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new builder: ' + newName);
                }
                break;
            case 'upgrader1':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,MOVE], name, {role: 'upgrader'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new upgrader: ' + newName);
                }
                break;

            // STAGE 2 : 5exts : 550energy
            case 'harvester2':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE], name, {role: 'harvester'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new harvester: ' + newName);
                }
                break;
            case 'builder2':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], name, {role: 'builder'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new builder: ' + newName);
                }
                break;
            case 'upgrader2':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE], name, {role: 'upgrader'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new upgrader: ' + newName);
                }
                break;
            // STAGE 3
            case 'harvester3':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], name, {role: 'harvester'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new harvester: ' + newName);
                }
                break;
            case 'builder3':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], name, {role: 'builder'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new builder: ' + newName);
                }
                break;
            case 'upgrader3':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], name, {role: 'upgrader'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new upgrader: ' + newName);
                }
                break;
            case 'defender3':
                var newName = Game.spawns['Spawn1'].createCreep([ATTACK,TOUGH,TOUGH,MOVE,MOVE], name, {role: 'defender'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new defender: ' + newName);
                }
                break;
            // STAGE 4
            case 'harvester4':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], name, {role: 'harvester'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new harvester: ' + newName);
                }
                break;
            case 'builder4':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], name, {role: 'builder'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new builder: ' + newName);
                }
                break;
            case 'upgrader4':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], name, {role: 'upgrader'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new upgrader: ' + newName);
                }
                break;
            case 'defender4':
                var newName = Game.spawns['Spawn1'].createCreep([ATTACK,TOUGH,TOUGH,MOVE,MOVE], name, {role: 'defender'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new defender: ' + newName);
                }
                break;
            case 'paver4':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE,MOVE], name, {role: 'paver'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new paver: ' + newName);
                }
                break;
            case 'repairer4':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE,MOVE], name, {role: 'repairer'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new repairer: ' + newName);
                }
                break;
            // STAGE 5
            case 'harvester5':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], name, {role: 'harvester'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new harvester: ' + newName);
                }
                break;
            case 'builder5':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], name, {role: 'builder'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new builder: ' + newName);
                }
                break;
            case 'upgrader5':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], name, {role: 'upgrader'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new upgrader: ' + newName);
                }
                break;    
            // MINERS / HAULERS
            case 'miner0':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,MOVE], name, {role: 'miner'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new miner: ' + newName);
                }
                break;
            case 'miner1':
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,MOVE], name, {role: 'miner'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new miner: ' + newName);
                }
                break;
            case 'minerEnergy': //creates miner based off energy CAPPED AT 4 WORK
                let energyMiner = Game.spawns['Spawn1'].room.energyAvailable;
                let numberOfPartsMiner = Math.floor((energyMiner-50) / 100);
                if(numberOfPartsMiner > 4){
                    numberOfPartsMiner = 4;
                }
                let bodyMiner = [];
                for (let i = 0; i < numberOfPartsMiner; i++) {
                    bodyMiner.push(WORK);
                }
                if(numberOfPartsMiner > 0) {
                    bodyMiner.push(MOVE);
                };
                var newName = Game.spawns['Spawn1'].createCreep(bodyMiner, name, {role: 'miner'});
                console.log('Spawning new miner: ' + newName);
                break;
            case 'hauler0':
                var newName = Game.spawns['Spawn1'].createCreep([CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], name, {role: 'miner'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new miner: ' + newName);
                }
                break;
            case 'hauler1':
                var newName = Game.spawns['Spawn1'].createCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], name, {role: 'miner'});
                if(newName!=-6&&newName!=-4) {
                    console.log('Spawning new miner: ' + newName);
                }
                break;  
            case 'haulerEnergy': //creates hauler based off energy
                let energyHauler = Game.spawns['Spawn1'].room.energyAvailable;
                let numberOfPartsHauler = Math.floor(energyHauler / 100);
                let bodyHauler = [];
                for (let i = 0; i < numberOfPartsHauler; i++) {
                    bodyHauler.push(CARRY);
                }
                for (let i = 0; i < numberOfPartsHauler; i++) {
                    bodyHauler.push(MOVE);
                }
                var newName = Game.spawns['Spawn1'].createCreep(bodyHauler, name, {role: 'hauler'});
                console.log('Spawning new hauler: ' + newName);
                break;
            
    
        }
    }
}

module.exports = spawn;
