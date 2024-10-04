//key: uuid, value array ->stage정보는 배열
const stages = {};

export const createStage = (uuid) => {
  stages[uuid] = [];
  console.log(`createStage`);
};

export const getStage = (uuid) => {
  console.log(`getStage`);
  return stages[uuid];
};

export const setStage = (uuid, id, timestamp, runScore, itemScore, totalScore) => {
  console.log(`setStage`);
  return stages[uuid].push({ id, timestamp, runScore, itemScore, totalScore });
};

export const clearStage = (uuid) => {
  console.log(`clearStage`);
  stages[uuid] = [];
};
