//유저는 스테이지를 하나씩만 올라갈 수 있다.

import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

//유저는 일정 점수가 되면 다음 스테이지로 이동한다.
export const moveStageHandler = (userId, payload) => {
  const { stages, items, itemUnlocks } = getGameAssets();
  //currentStage, targetStage
  //유저의 현재 스테이지 정보
  let currentStages = getStage(userId);
  console.log(userId);
  console.log(currentStages);
  if (!currentStages.length) {
    return { status: 'fail', message: 'no stages found for user' };
  }

  //오름차순 -> 가장 큰 스테이지 ID를 확인 <- 유저의 현재 스테이지
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  //클라이언트 서버 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'current stage mismatch' };
  }

  //검증
  const stageIndex = payload.currentStage - 1000;
  const serverTime = Date.now(); //현재 타임스탬프
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;

  //스테이지 변경값이자 달리기만 했을경우 달리기 최대치값
  const maxboundary = stages.data[payload.targetStage - 1000].score - stages.data[stageIndex].score;

  //최고점수 아이템 최소시간 생성으로 전부 먹을경우의 최소 시간
  //내림으로 약간의 여유를 줌
  const mintime = Math.floor(
    maxboundary /
      (items.data[itemUnlocks.data[stageIndex].item_id - 1].score +
        stages.data[stageIndex].scorePerSecond),
  );

  //최소시간보다 짧은 시간에 점수를 달성 = 강제로 점수를 늘릴경우
  if (elapsedTime < mintime) {
    return { status: 'fail', message: 'Invalid elapsed time' };
  }

  //totalScore가 확실한건지 검증
  //강제로 totalScore를 늘릴경우를 생각해서 처리
  if (payload.totalScore - (payload.runScore + payload.itemScore) > Math.abs(5)) {
    return { status: 'fail', message: 'The totalScore is the problem.' };
  }

  //달리기만 했을경우 최대치를 통신지연 생각해서 비교
  const nowRunScore = payload.runScore - currentStage.runScore;
  if (nowRunScore > maxboundary + 5) {
    return { status: 'fail', message: 'RunScore is too large.' };
  }

  // 아이템 점수에대한 검증
  const maxItemScore = items.data[itemUnlocks.data[stageIndex].item_id - 1].score * mintime;
  if (payload.itemScore - currentStage.itemScore > maxItemScore) {
    return { status: 'fail', message: 'The itemScore is too high. ' };
  }

  // targetStage 대한 검정 <- 게임에셋에 존재하는 스테이지인가
  if (!stages.data.some((stages) => stages.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage not found' };
  }

  setStage(
    userId,
    payload.targetStage,
    serverTime,
    payload.runScore,
    payload.itemScore,
    payload.totalScore,
  );

  console.log('Stage: ', getStage(userId));

  return { status: 'success' };
};
