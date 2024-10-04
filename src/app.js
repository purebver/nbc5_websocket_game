import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';
import { createClient } from 'redis';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/assets', express.static('assets'));

initSocket(server);

app.get('/', (req, res, next) => {
  res.send('hello world');
});

server.listen(PORT, async () => {
  console.log(`server is running on port ${PORT}`);

  //서버가 실행 될 때 실행 될 파일
  try {
    const assets = await loadGameAssets();
    console.log('Assets loaded successfully');
  } catch (err) {
    console.error('Failed to load game assets: ', err);
  }
});
