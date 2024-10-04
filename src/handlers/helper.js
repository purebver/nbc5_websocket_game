import { CLIENT_VERSION } from '../constants.js';
import { createItem } from '../models/item.model.js';
import { createStage, getStage, setStage } from '../models/stage.model.js';
import { getUser, removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';

export const handleDisconnect = (socket, uuid, redisClient) => {
  removeUser(socket.id, redisClient);
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users: ', getUser());
};

export const handleConnection = (socket, uuid) => {
  console.log(`New user connected!: ${uuid} with socket ID ${socket.id}`);
  console.log('Current users: ', getUser());

  createItem(uuid);
  createStage(uuid);

  socket.emit('connection', { uuid });
};

export const handlerEvent = async (io, socket, data) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return;
  }

  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'handler not found' });
  }

  const response = await handler(data.userId, data.payload, socket, io);
  console.log('response: ', response);
  if (response.broadcast) {
    io.emit('response', response.broadcast);
    return;
  }

  socket.emit('response', response);
};
