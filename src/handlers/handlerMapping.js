import { gameEnd, gameStart } from './game.handle.js';
import { newTotalHighScoreSet } from './highscore.handler.js';
import { getItemHandler } from './item.handler.js';
import { verifyScore } from './laststage.handler.js';
import { moveStageHandler } from './stage.handler.js';

//각 숫자마다 이벤트 맵핑
const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
  12: getItemHandler,
  13: newTotalHighScoreSet,
  14: verifyScore,
};

export default handlerMappings;
