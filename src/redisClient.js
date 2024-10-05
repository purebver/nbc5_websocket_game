import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

//레디스 클라이언트
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

async function redisConnect() {
  try {
    await redisClient.connect();
    console.log('레디스 커넥트 완료');
  } catch (err) {
    console.log('레디스 커넥트 중 오류', err);
  }
}
redisConnect();

export default redisClient;
