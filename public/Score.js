import { sendEvent } from './Socket.js';

let unlockInfo;
let items;
let stages;
let stagesLength;

async function loadJson() {
  const [item_unlockResponse, itemResponse, stageResponse] = await Promise.all([
    fetch('/assets/item_unlock.json'),
    fetch('/assets/item.json'),
    fetch('/assets/stage.json'),
  ]);
  [unlockInfo, items, stages] = await Promise.all([
    item_unlockResponse.json(),
    itemResponse.json(),
    stageResponse.json(),
  ]);
  stagesLength = stages.data.length - 1;
}

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = false;
  num = 0;
  leng = 0;
  currentStage = 0;
  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.waitStage();
  }

  async waitStage() {
    await loadJson();
    this.leng = stagesLength;
  }

  //스테이지 업데이트
  update(deltaTime) {
    this.currentStage = stages.data[this.num].id;
    this.score += deltaTime * 0.01 * (this.num + 1);
    // 점수가 stages.data[this.num + 1].score 이상이 될 시 스테이지 변경
    if (this.num < this.leng) {
      if (this.score >= stages.data[this.num + 1].score) {
        this.stageChange = true;
        sendEvent(11, {
          currentStage: this.currentStage,
          targetStage: stages.data[this.num + 1].id,
        });
        this.num++;
        setTimeout(() => {
          this.stageChange = false;
        }, 1000);
      }
    }
  }

  //아이템 획득할 시 점수
  getItem(itemId) {
    sendEvent(4, {
      currentStage: this.currentStage,
      itemId: itemId - 1,
    });
    this.score += items.data[itemId - 1].score;
  }

  reset() {
    this.score = 0;
    this.num = 0;
    this.stageChange = false;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const nowStage = this.num + 1;
    const y = 20 * this.scaleRatio;

    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 100 * this.scaleRatio;
    const stageX = scoreX - 175 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);
    const stagePadded = nowStage.toString().padStart(1, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
    this.ctx.fillText(`Stage ${stagePadded}`, stageX, y);
  }
}

export default Score;
