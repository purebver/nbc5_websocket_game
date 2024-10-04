import redisClient from '../redisClient.js';

export const totalHighScoreSet = async (socket) => {
  try {
    console.log('레디스에서 totalHighScore 불러오는중');
    const totalHighScore = await redisClient.get('totalHighScore');
    socket.emit('highScoreSet', { totalHighScore });
    console.log('레디스에서 totalHighScore 불러오기 완료');
  } catch (err) {
    console.error('highscoreset불러오기중 오류: ', err);
  }
};

export const newTotalHighScoreSet = async (userId, payload, socket, io) => {
  try {
    console.log('레디스에 새로운 totalHighScore 저장중');
    const totalHighScore = await redisClient.get('totalHighScore');

    //다른 유저가 먼저 갱신햇을 경우를 대비해 한번 더 검사
    if (payload.score > Number(totalHighScore)) {
      await redisClient.set('totalHighScore', payload.score);
      await redisClient.set('totalHighScoreUser', userId);
      console.log('레디스에 새로운 totalHighScore 저장 완료');

      //모든 접속중인 유저 totalHighScore 변경
      io.emit('highScoreSet', { totalHighScore: payload.score });

      //브로드케스트
      return { broadcast: `${userId}님이 T-HighScore를 갱신하였습니다!` };
    }
    console.log('다른 유저가 갱신한 값이 더 큽니다.');
    return { status: 'success' };
  } catch (err) {
    console.error('새로운 totalHighScore 저장중 오류: ', err);
  }
};
