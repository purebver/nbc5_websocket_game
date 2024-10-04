import { gameEnd, gameStart } from './game.handle.js';
import { newTotalHighScoreSet } from './highscore.handler.js';
import { getItemHandler } from './item.handler.js';
import { moveStageHandler } from './stage.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
  12: getItemHandler,
  13: newTotalHighScoreSet,
};

export default handlerMappings;
