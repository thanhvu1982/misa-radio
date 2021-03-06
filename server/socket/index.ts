import socketIO, { Socket } from 'socket.io';
import { httpServer } from '../index';
import * as roomsService from '../services/rooms';
import * as youtubeService from '../services/youtube';
import { createRoomValidator } from '../validators/rooms/createRoom';
import { joinRoomValidator } from '../validators/rooms/joinRoom';
import { orderSongValidator } from '../validators/rooms/orderSong';
import { authSocket } from './socketAuth';

export const io = new socketIO.Server();
io.attach(httpServer);

io.on('connection', (socket: Socket) => {
  // Leave all rooms that be created or joined when disconnected
  socket.on('disconnect', () => {
    try {
      const roomId = roomsService.leaveRooms(socket.id);
      io.to(roomId).emit('leave-room', {
        userId: socket.id,
      });
    } catch (e: any) {
      socket.emit('error', e.message);
    }
  });

  // Create room
  socket.on('create-room', (payload: { name: string }) => {
    const user = authSocket(socket);
    if (!user) return socket.emit('error', 'Unauthorized');
    try {
      const _payload = createRoomValidator(payload);
      const roomId = roomsService.createRoom(_payload.name, user);
      socket.emit('create-room-success', { roomId });
    } catch (e: any) {
      socket.emit('error', e.message);
    }
  });

  // Join room
  socket.on('join-room', (payload: { roomId: string }) => {
    const user = authSocket(socket);
    if (!user) return socket.emit('error', 'Unauthorized');
    try {
      const _payload = joinRoomValidator(payload);
      const foundRoom = roomsService.getRoom(_payload.roomId);
      if (!foundRoom) {
        socket.emit('join-room-fail');
      } else {
        const { room, existed } = roomsService.joinRoom(_payload.roomId, user);
        if (!existed) socket.join(room.id);
        const { playing, startAt } = room.getPlaying();
        socket.emit('join-room-success', {
          room,
          playing,
          startAt,
        });
        socket.to(_payload.roomId).emit('join-room', {
          user,
        });
      }
    } catch (e: any) {
      socket.emit('error', e.message);
    }
  });

  // Order song
  socket.on('order-song', async (payload: { roomId: string; id: string }) => {
    const user = authSocket(socket);
    if (!user) return socket.emit('error', 'Unauthorized');
    try {
      const { roomId } = orderSongValidator(payload);
      const song = await youtubeService.getVideoById(payload.id);
      song.orderBy = user.name;
      const room = roomsService.orderSong(roomId, user.id, song);
      if (room && room.getPlaying().playing) {
        io.to(roomId).emit('order-song-success', {
          queue: room.queue,
        });
      }
    } catch (e: any) {
      socket.emit('error', e.message);
    }
  });

  socket.on('skip', async (payload: { roomId: string }) => {
    const user = authSocket(socket);
    if (!user) return socket.emit('error', 'Unauthorized');
    try {
      roomsService.skip(payload.roomId, user.id);
    } catch (e: any) {
      socket.emit('error', e.message);
    }
  });
});
