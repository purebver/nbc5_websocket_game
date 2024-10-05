import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let gameAssets = {};

//현재경로/파일이름
const __filename = fileURLToPath(import.meta.url);
//현재경로
const __dirname = path.dirname(__filename);
//최상위경로/assets
const basePath = path.join(__dirname, '../../assets');

//파일 읽는 함수
//비동기
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

//Promise.all 로 비동기 json파일 3개 읽어오기
export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);
    gameAssets = { stages, items, itemUnlocks };
    return gameAssets;
  } catch (err) {
    throw new Error('Failed to load game assets: ' + err.message);
  }
};

//위의 값들 다른곳에서 받아오기
export const getGameAssets = () => {
  return gameAssets;
};
