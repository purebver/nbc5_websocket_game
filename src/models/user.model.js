import redisClient from '../redisClient.js';

export const addUser = async (user) => {
  try {
    await redisClient.flushDb();
    await redisClient.set(`user:${user.socketId}`, user.uuid);
    console.log('레디스에 유저 저장 완료');
  } catch (err) {
    console.error('레디스에 유저 저장중 오류:', err);
  }
};

export const removeUser = async (socketId) => {
  try {
    await redisClient.del(`user:${socketId}`);
    console.log('레디스에서 유저 삭제 성공');
  } catch (err) {
    console.error('레디스에 유저 삭제중 오류:', err);
  }
};

export const getUser = async () => {
  try {
    const keys = await redisClient.keys(`user:*`);
    const users = await Promise.all(
      keys.map(async (key) => {
        const uuid = await redisClient.get(key);
        return { uuid, socketId: key };
      }),
    );
    return users;
  } catch (err) {
    console.error('레디스에 유저 삭제중 오류:', err);
    return [];
  }
};
