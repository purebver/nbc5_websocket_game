import { CLIENT_VERSION } from './Constants.js';

const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
socket.on('response', (data) => {
  console.log(data);
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
});

socket.on('localUUID', ({ uuid }) => {
  localStorage.setItem('userUUID', uuid);
  console.log('local에 UUID를 저장하였습니다');
});

socket.on('highScoreSet', ({ totalHighScore }) => {
  if (totalHighScore === null) {
    totalHighScore = 0;
  }
  localStorage.setItem('totalHighScore', totalHighScore);
  console.log('totalHighScore 세팅 환료');
});

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

const sendUUID = (userUUID) => {
  socket.emit('connectUser', { uuid: userUUID });
};

export { sendEvent, sendUUID };
