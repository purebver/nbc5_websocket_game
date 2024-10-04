import redisClient from '../redisClient.js';
const users = [];

export const addUser = async (user) => {
  users.push(user);
  try {
    //await redisClient.flushDb();
    await redisClient.set(user.socketId, user.uuid);
    console.log('레디스에 유저 저장 완료');
  } catch (err) {
    console.error('레디스에 유저 저장중 오류:', err);
  }
};

export const removeUser = async (socketId) => {
  try {
    await redisClient.del(socketId);
    console.log('레디스에서 유저 삭제 성공');
  } catch (err) {
    console.error('레디스에 유저 삭제중 오류:', err);
  }
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getUser = () => {
  return users;
};
