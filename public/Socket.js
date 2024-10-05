import { CLIENT_VERSION } from './Constants.js';

//연결될 서버의 주소(ec2사용 시 변경)
const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;

//각 이벤트 별 받아오기 (on)
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
  console.log('totalHighScore 세팅 완료');
});

//이벤트 보내기(emit)
const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

//유저 데이터 보내기
const sendUUID = (userUUID) => {
  socket.emit('connectUser', { uuid: userUUID });
};

export { sendEvent, sendUUID };
