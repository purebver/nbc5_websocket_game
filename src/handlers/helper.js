import { CLIENT_VERSION } from '../constants.js';
import { createItem } from '../models/item.model.js';
import { createStage, getStage, setStage } from '../models/stage.model.js';
import { getUser, removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';

//유저와 접속이 해제될경우
export const handleDisconnect = async (socket, uuid, redisClient) => {
  removeUser(socket.id, redisClient);
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users: ', await getUser());
};

//유저와 연결될경우
export const handleConnection = async (socket, uuid) => {
  console.log(`New user connected!: ${uuid} with socket ID ${socket.id}`);
  console.log('Current users: ', await getUser());

  createItem(uuid);
  createStage(uuid);

  socket.emit('connection', { uuid });
};

//클라이언트의 Socket.js의 sendEvent를 받아오는곳
export const handlerEvent = async (io, socket, data) => {
  //버전 검증
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return;
  }

  //어디 함수로 보낼지 맵핑
  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'handler not found' });
  }

  //맵핑된 함수의 반환값을 저장
  const response = await handler(data.userId, data.payload, socket, io);
  console.log('response: ', response);

  //브로트캐스트가 포함될 경우 전체발송
  if (response.broadcast) {
    io.emit('response', response.broadcast);
    return;
  }

  //브로드캐스트 아닐경우 반환값 발송
  socket.emit('response', response);
};
