import { ErrorMapper } from "utils/ErrorMapper";
import runHarvester from 'roles/harvester';
import runUpgrader from 'roles/upgrader';
import runBuilder from 'roles/builder';

enum CREEP_ROLE {
  HARVESTER = 'h',
  UPGRADER = 'u',
  BUILDER = 'b',
}

const getRandomName = (prefix: string = ''): string =>  {
  return prefix + Math.random().toString(36).substring(4);
};

const CREEP_TYPE_RUNNER: { [key: string]: (creep: Creep) => any } = {
  [CREEP_ROLE.HARVESTER]: runHarvester,
  [CREEP_ROLE.UPGRADER]: runUpgrader,
  [CREEP_ROLE.BUILDER]: runBuilder,
};

const runCreep = (creep: Creep) => {
  if (creep.memory) {
    CREEP_TYPE_RUNNER[creep.memory.role](creep);
  }
};

const makeMinimum = (parts: BodyPartConstant[], role: CREEP_ROLE, num: number) => {
  const MainSpawn = Game.spawns.Spawn1;
  if (MainSpawn.room.find(FIND_CREEPS).filter(creep => creep.memory && creep.memory.role === role).length < num) {
    MainSpawn.spawnCreep(parts, getRandomName(role), { memory: { role } });
  }
};

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  const MainSpawn = Game.spawns.Spawn1;

  makeMinimum([MOVE, MOVE, CARRY, CARRY, WORK], CREEP_ROLE.HARVESTER, 2);
  makeMinimum([MOVE, CARRY, WORK, WORK], CREEP_ROLE.UPGRADER, 3);
  makeMinimum([MOVE, CARRY, WORK, WORK], CREEP_ROLE.BUILDER, 5);
  MainSpawn.room.find(FIND_CREEPS).forEach(runCreep);
});
