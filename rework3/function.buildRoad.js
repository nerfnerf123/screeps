// CHECKS IF CREEP IS STANDING ON ROAD, IF NOT BUILD ONE
module.exports = {
    buildRoad: function(creep){
        //console.log("IM WORKING!");
        var constructs = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(constructs.length < 4){ // implement if less than 4 roads in queue then build
            var roads = creep.pos.findInRange(FIND_STRUCTURES, 0, {filter: (s)=>s.structureType==STRUCTURE_ROAD}); // checks if there is a road where the creep is standing
            if(roads.length == 0 && Memory.stage>=2){ // if no roads (i.e 0) then make a construction site for a road !!!!!! WE HAVE TO BUILD AT STAGE 3 OTHERWISE IT INTERFERES WITH THE EXTENSIONS - nvm since only haulers are building this now
                creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD); // at the creep's position in it's room, create the road
            }
        }
    }
}