import { getGameAssets } from '../init/assets.js';

export const getitem = (userId, payload) => {
  //유저의 현재 스테이지 정보
  const stageIndex = payload.currentStage - 1000;
  const itemIdIndex = payload.itemId;
  const { items, itemUnlocks } = getGameAssets();
  console.log(`stage: ${stageIndex + 1}`);
  console.log(`itemId: ${itemIdIndex + 1}`);
  return { status: 'success' };
};
