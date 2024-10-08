import { sendEvent } from './Socket.js';
import items from '../assets/item.json' with { type: 'json' };
import stages from '../assets/stage.json' with { type: 'json' };

class Score {
  //각 필요한 변수들
  score = 0;
  runScore = 0;
  itemScore = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = false;
  stageIndex = 0;
  leng = stages.data.length - 1;
  addVerify = 1300;
  verify = stages.data[this.leng].score + this.addVerify;
  currentStage = 0;
  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  //스테이지 업데이트
  //각 스테이지마다 초당 점수 10 * 스테이지
  update(deltaTime) {
    this.currentStage = stages.data[this.stageIndex].id;
    //기본 점수 획득값 0.001은 1초당
    this.runScore += deltaTime * 0.001 * stages.data[this.stageIndex].scorePerSecond;
    //아이템 + 기본점수 합
    this.score = this.runScore + this.itemScore;
    //최종스테이지면 다음 스테이지가 없으므로 pass
    if (this.stageIndex < this.leng) {
      //점수가 stages.data[this.stageIndex + 1].score 이상이 될 시 스테이지 변경
      if (this.score >= stages.data[this.stageIndex + 1].score) {
        this.stageChange = true;
        sendEvent(11, {
          currentStage: this.currentStage,
          targetStage: stages.data[this.stageIndex + 1].id,
          runScore: this.runScore,
          itemScore: this.itemScore,
          totalScore: this.score,
        });
        this.stageIndex++;
        setTimeout(() => {
          this.stageChange = false;
        }, 1000);
      }
      //최종 스테이지 도달 후 일정 점수마다 검증작업
    } else if (Math.floor(this.score) >= this.verify) {
      sendEvent(14, {
        currentStage: this.currentStage,
        runScore: this.runScore,
        itemScore: this.itemScore,
        totalScore: this.score,
      });
      //다음 검증
      this.verify += this.addVerify;
    }
  }

  //아이템 획득할 시 점수
  getItem(itemId) {
    this.itemScore += items.data[itemId - 1].score;
    sendEvent(12, {
      currentStage: this.currentStage,
      itemId: itemId,
      itemScore: this.itemScore,
    });
  }

  //reset이 발동될 경우 초기화될 변수들
  reset() {
    this.score = 0;
    this.stageIndex = 0;
    this.runScore = 0;
    this.itemScore = 0;
    this.stageChange = false;
    this.verify = stages.data[this.leng].score + this.addVerify;
  }

  //하이스코어 세팅
  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const totalHighScore = Number(localStorage.getItem('totalHighScore'));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
      if (this.score > totalHighScore) {
        sendEvent(13, {
          score: Math.floor(this.score),
        });
      }
    }
  }

  getScore() {
    return this.score;
  }

  //화면에 stage, T-HI(total-highscore), U-HI(user-hignscore), 현 점수 그리기
  draw() {
    const nowStage = this.stageIndex + 1;
    const y = 20 * this.scaleRatio;

    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));

    const totalHighScore = Number(localStorage.getItem('totalHighScore'));

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 150 * this.scaleRatio;
    const totalHighScoreX = highScoreX - 150 * this.scaleRatio;
    const stageX = 10;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);
    const totalHighScorePadded = totalHighScore.toString().padStart(6, 0);
    const stagePadded = nowStage.toString().padStart(1, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`U-HI ${highScorePadded}`, highScoreX, y);
    this.ctx.fillText(`T-HI ${totalHighScorePadded}`, totalHighScoreX, y);
    this.ctx.fillText(`Stage ${stagePadded}`, stageX, y);
  }
}

export default Score;
