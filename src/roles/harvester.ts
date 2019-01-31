export default (creep: Creep) => {
  if (creep.carry.energy < creep.carryCapacity) {
    creep.memory.isIdle = false;
    const sources = creep.room.find(FIND_SOURCES);
    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  }
  else {
    const targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType === STRUCTURE_EXTENSION ||
          structure.structureType === STRUCTURE_SPAWN ||
          structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
      }
    });
    if (targets.length > 0) {
      creep.memory.isIdle = false;
      if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
      }
    } else {
      if (!creep.memory.isIdle) {
        creep.moveTo(creep.pos.x - 2, creep.pos.y-2);
      }
      creep.memory.isIdle = true;
    }
  }
};
