import { getGameAssets } from '../init/assets.js';
import { clearItem, setItem } from '../models/item.model.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';

export const gameStart = (uuid, payload) => {
  // stages 배열에서 0번째 = 첫번째 스테이지
  const { stages } = getGameAssets();

  clearItem(uuid);
  clearStage(uuid);
  setItem(uuid, 0, payload.timestamp, 0);
  setStage(uuid, stages.data[0].id, payload.timestamp, 0, 0, 0);
  console.log('Stage: ', getStage(uuid));

  return { status: 'success' };
};

export const gameEnd = (uuid, payload) => {
  //클라이언트는 게임종료 타임스탬프와 마지막 점수를 줌
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  //각 스테이지의 지속 시간을 계산하여 총 점수 계산
  let totalScore = 0;
  stages.array.forEach((stage, index) => {
    let stageEndTime;
    if (index == stages.length - 1) {
      stageEndTime = gameEndTime;
    } else {
      stageEndTime = stages[index + 1].timestamp;
    }

    //초당 1점
    const stageDuration = (gameEndTime - stage.timestamp) / 100;
    totalScore += stageDuration;
  });

  //점수와 타임스태프 검증
  //5는 오차범위 abs는 절대값
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  //DB저장 가정
  //저장
  //setResult(userId, score, timestamp)

  return { status: 'success', message: 'Game ended', score };
};
