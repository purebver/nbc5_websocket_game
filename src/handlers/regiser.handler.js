import { addUser } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';
import { totalHighScoreSet } from './highscore.handler.js';
import redisClient from '../redisClient.js';

const registerHandler = (io) => {
  io.on('connection', (socket) => {
    //connection 이벤트 처리
    //접속
    socket.on('connectUser', async ({ uuid }) => {
      let userUUID = uuid;
      if (!userUUID) {
        userUUID = uuidv4();
        console.log('userUUID보내는중');

        socket.emit('localUUID', { uuid: userUUID });
      }

      //레디스에 저장된 하이스코어를 로컬에 저장
      totalHighScoreSet(socket);

      //유저 추가
      addUser({ uuid: userUUID, socketId: socket.id });

      //레디스에 저장된 하이스코어 불러오기
      const highScoreUser = await redisClient.get('totalHighScoreUser');

      //저장된 하이스코어 달성자와 유저의 uuid가 동일할 경우 log전송
      if (userUUID === highScoreUser) {
        socket.emit('response', '서버 1위! 안녕하세요');
      }

      //접속 후
      handleConnection(socket, userUUID);
      socket.on('event', (data) => handlerEvent(io, socket, data));

      //접속 해제 시 이벤트
      socket.on('disconnect', () => {
        handleDisconnect(socket, userUUID);
      });
    });
  });
};

export default registerHandler;
