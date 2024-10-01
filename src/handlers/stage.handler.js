//유저는 스테이지를 하나씩만 올라갈 수 있다.

import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

//유저는 일정 점수가 되면 다음 스테이지로 이동한다.
export const moveStageHandler = (userId, payload) => {
  //currentStage, targetStage
  //유저의 현재 스테이지 정보
  let currentStages = getStage(userId);
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

  //점수 검증
  const serverTime = Date.now(); //현재 타임스탬프
  const elapsedTime = (serverTime - currentStage.timestamp) / 100;

  //1스테 -> 2스테 넘어가는 과정
  //105의 5는 임의로 정한 오차 범위
  //서버와 클라이언트간의 통신이 지연(여기선 5)되거나 했을 경우 그냥 에러처리
  // if (elapsedTime < 100 || elapsedTime > 105) {
  //   return { status: 'fail', message: 'Invalid elapsed time' };
  // }

  // targetStage 대한 검정 <- 게임에셋에 존재하는 스테이지인가
  const { stages } = getGameAssets();
  if (!stages.data.some((stages) => stages.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage not found' };
  }

  setStage(userId, payload.targetStage, serverTime);
  console.log('Stage: ', getStage(userId));

  return { status: 'success' };
};
