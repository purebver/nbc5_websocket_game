//key: uuid, value array ->stage정보는 배열
const stages = {};

//유저의 스테이지 배열 생성
export const createStage = (uuid) => {
  stages[uuid] = [];
  console.log(`createStage`);
};

//유저 스테이지 받아오기
export const getStage = (uuid) => {
  console.log(`getStage`);
  return stages[uuid];
};

//유저 스테이지 첫 세팅
export const setStage = (uuid, id, timestamp, runScore, itemScore, totalScore) => {
  console.log(`setStage`);
  return stages[uuid].push({ id, timestamp, runScore, itemScore, totalScore });
};

//유저 스테이지 비우기
export const clearStage = (uuid) => {
  console.log(`clearStage`);
  stages[uuid] = [];
};
