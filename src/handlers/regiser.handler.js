import { addUser } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

const registerHandler = (io) => {
  io.on('connection', (socket) => {
    //connection 이벤트 처리
    //접속
    const userUUID = uuidv4();
    addUser({ uuid: userUUID, socketId: socket.id });

    //접속 후
    handleConnection(socket, userUUID);
    socket.on('event', (data) => handlerEvent(io, socket, data));

    //접속 해제 시 이벤트
    socket.on('disconnect', (socket) => {
      handleDisconnect(socket, userUUID);
    });
  });
};

export default registerHandler;
