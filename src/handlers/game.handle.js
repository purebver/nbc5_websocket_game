import { getGameAssets } from '../init/assets.js';
import { clearItem, setItem } from '../models/item.model.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';
import { verifyScore } from './laststage.handler.js';

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

  const { timestamp: gameEndTime, currentStage, runScore, itemScore, totalScore } = payload;
  const stages = getStage(uuid);

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  //모든 점수 검증
  verifyScore(uuid, payload);

  return { status: 'success', message: 'Game ended', Score: Math.floor(totalScore) };
};
