import { getGameAssets } from '../init/assets.js';
import { setItem, getItem } from '../models/item.model.js';

export const getItemHandler = (userId, payload) => {
  const { items, itemUnlocks } = getGameAssets();
  const getItems = getItem(userId);
  const stageIndex = payload.currentStage - 1000;
  const itemIdIndex = payload.itemId - 1;
  const serverTime = Date.now();

  const item = getItems[getItems.length - 1];
  const elapsedTime = (serverTime - item.timestamp) / 1000;

  //아이템 획득 최소 시간 검증
  if (elapsedTime < 1) {
    return { status: 'fail', message: '아이템 획득 시간이 비정상입니다.' };
  }

  //스테이지에 나와서는 안될 아이템일 경우
  if (payload.itemId > itemUnlocks.data[stageIndex].item_id) {
    return { status: 'fail', message: '현 스테이지에 존재 해서는 안될 아이템.' };
  }

  //획득 아이템 점수 검증
  if (items.data[itemIdIndex].score !== payload.itemScore - item.itemScore) {
    console.log(items.data[itemIdIndex].score);
    console.log(payload.itemScore, item.itemScore);
    return { status: 'fail', message: '획득한 아이템 점수 이상.' };
  }

  setItem(userId, payload.itemId, serverTime, payload.itemScore);

  console.log('item: ', getItem(userId));

  return { status: 'success' };
};
