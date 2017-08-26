// SPAWNS CREEP USING SWITCH CASE
var spawn = {

    run: function(creepBody, name, home, target) { // creepBody is the body of the creep, while name is either the role, or the name of the miners/haulers, homeRoom is for long distance harvesters
        switch(creepBody){
            case 'generalEnergy': //creates miner based off energy CAPPED AT 4 WORK
                let energyGeneral = (Game.spawns['Spawn1'].room.energyAvailable);
                let numberOfPartsGeneral = Math.floor((energyGeneral) / 200); // divide by the total cost of parts
                let bodyGeneral = [];
                /*
                if(numberOfPartsGeneral > 0) {
                    bodyGeneral.push(WORK);
                }; */
                if(numberOfPartsGeneral > 6) {
                    numberOfPartsGeneral = 6;
                };
                for (let i = 0; i < numberOfPartsGeneral; i++) {
                    bodyGeneral.push(WORK);
                };
                for (let i = 0; i < numberOfPartsGeneral; i++) {
                    bodyGeneral.push(CARRY);
                };
                for (let i = 0; i < numberOfPartsGeneral; i++) {
                    bodyGeneral.push(MOVE);
                };
                var newName = Game.spawns['Spawn1'].createCreep(bodyGeneral, undefined, {role: name});
                console.log('Spawning new ' + name + ': ' + newName);
                break;
            case 'defenderEnergy': 
                let energyDefender = (Game.spawns['Spawn1'].room.energyAvailable);
                let numberOfPartsDefender = Math.floor((energyDefender) / 190); // divide by the total cost of parts
                let bodyDefender = [];
                for (let i = 0; i < numberOfPartsDefender; i++) {
                    bodyDefender.push(MOVE);
                    bodyDefender.push(MOVE);
                };
                for (let i = 0; i < numberOfPartsDefender; i++) {
                    bodyDefender.push(TOUGH);
                };
                for (let i = 0; i < numberOfPartsDefender; i++) {
                    bodyDefender.push(ATTACK);
                };
                var newName = Game.spawns['Spawn1'].createCreep(bodyDefender, undefined, {role: name});
                console.log('Spawning new ' + name + ': ' + newName);
                break;
            case 'minerEnergy': //creates miner based off energy CAPPED AT 5 WORK
                let energyMiner = (Game.spawns['Spawn1'].room.energyAvailable);
                let numberOfPartsMiner = Math.floor((energyMiner-50) / 100);
                if(numberOfPartsMiner > 6){
                    numberOfPartsMiner = 6;
                };
                let bodyMiner = [];
                for (let i = 0; i < numberOfPartsMiner; i++) {
                    bodyMiner.push(WORK);
                };
                if(numberOfPartsMiner > 0) {
                    bodyMiner.push(MOVE);
                };
                var newName = Game.spawns['Spawn1'].createCreep(bodyMiner, name, {role: 'miner'});
                console.log('Spawning new miner: ' + newName);
                break;
            case 'haulerEnergy': //creates hauler based off energy
                let energyHauler = (Game.spawns['Spawn1'].room.energyAvailable)/2;
                let numberOfPartsHauler = Math.floor(energyHauler / 100);
                let bodyHauler = [];
                for (let i = 0; i < numberOfPartsHauler; i++) {
                    bodyHauler.push(CARRY);
                };
                for (let i = 0; i < numberOfPartsHauler; i++) {
                    bodyHauler.push(MOVE);
                };
                var newName = Game.spawns['Spawn1'].createCreep(bodyHauler, name, {role: 'hauler'});
                console.log('Spawning new hauler: ' + newName);
                break;
            case 'remoteHarvester':
                let energyRemote = (Game.spawns['Spawn1'].room.energyAvailable)*0.9;
                let numberOfPartsRemote = Math.floor(energyRemote / 250);
                let bodyRemote = [];
                for (let i = 0; i < numberOfPartsRemote; i++) {
                    bodyRemote.push(WORK);
                };
                for (let i = 0; i < numberOfPartsRemote; i++) {
                    bodyRemote.push(CARRY);
                };
                for (let i = 0; i < numberOfPartsRemote; i++) {
                    bodyRemote.push(MOVE);
                    bodyRemote.push(MOVE);
                };
                var newName = Game.spawns['Spawn1'].createCreep(bodyRemote, name, {role: 'remoteHarvester', home: home, target: target, dropping: true});
                console.log('Spawning new remoteHarvester: ' + newName);
                break;
            case 'claimer':
                var newName = Game.spawns['Spawn1'].createCreep([ATTACK,CLAIM,CLAIM,MOVE,MOVE,MOVE], name, {role: 'claimer', home: home, target: target});
                console.log('Spawning new remoteClaimer: ' + newName);
                break;
            
        };
    }
}

module.exports = spawn;
