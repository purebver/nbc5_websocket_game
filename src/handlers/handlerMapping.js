import { gameEnd, gameStart } from './game.handle.js';
import { getitem } from './item.handler.js';
import { moveStageHandler } from './stage.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  4: getitem,
  11: moveStageHandler,
};

export default handlerMappings;
