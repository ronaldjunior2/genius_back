import http from 'http';

import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Room } from './room';

import { Player } from './player';

export class App {
  readonly app = express();

  players: any = [];

  rooms: any = [];

  server;

  io;

  constructor() {
    this.app.use(express.json());
    this.app.use(cors());
    this.server = http.createServer(this.app);
    this.io = new Server(this.server, { cors: { origin: '*' } });

    this.app.get('/rooms', (req, res) => {
      res.send(this.rooms).status(200);
    });

    this.app.get('/players', (req, res) => {
      res.send(this.players).status(200);
    });

    this.app.get('/room/:id', (req, res) => {
      const { id } = req.params;
      res.send(this.rooms.find((r) => r.id === id)).status(200);
    });

    this.io.on('connection', (socket) => {
      console.log(socket.id);
      socket.on('newPlayer', (name) => {
        const newPLayer = new Player(name, socket.id);
        console.log(name);
        this.players.push(newPLayer);
        this.io.emit('playerConnected', this.players);
      });
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      socket.on('newRoom', (data) => {
        const newRoom = new Room(data, uuidv4(), socket.id, this.players.find((p) => p.id === socket.id).name);

        this.rooms.push(newRoom);

        socket.join(newRoom.id);
        socket.broadcast.emit('roomList', this.rooms);
        this.io.to(socket.id).emit('owerEntryRoom', newRoom.id);
        console.log(newRoom);
      });

      socket.on('entryRoom', (roomId) => {
        socket.join(roomId);
        const room = this.rooms.find((r) => r.id === roomId);
        room.players.push(this.players.find((p) => p.id === socket.id));
        this.io.to(roomId).emit('roomInfos', room);
      });

      socket.on('sendMessage', (message) => {
        // console.log(socket.rooms);
        // console.log(Object.keys(socket.rooms)[0]);
        const arr = Array.from(this.io.sockets.adapter.rooms);
        console.log(arr);
        socket.broadcast.emit('message', socket.rooms);
      });
      //
      socket.on('startGame', (roomId) => {
        const room = this.rooms.find((r) => r.id === roomId);
        if (room.ownerId === socket.id) {
          room.startGame();
          this.io.to(roomId).emit('startTurn', room.game);
        }
      });

      socket.on('color', ({ roomId, color }) => {
        const room = this.rooms.find((r) => r.id === roomId);
        if (room.game.playerTurnInfos.id === socket.id) {
          const colorIsRight: boolean = room.game.aswerIsRight(color);
          if (colorIsRight) {
            socket.emit('colorWarning', color);
            const isTheLasPLay: boolean = room.game.isTheLastPlayOfPlayer();
            console.log(isTheLasPLay);
            console.log('certo');
            if (isTheLasPLay) {
              console.log('proximo');
              room.game.nextTurn();
              this.io.to(roomId).emit('startTurn', room.game);
            }
          } else {
            console.log('errado');
            // room.game.removePlayer(socket.id);
            room.game.nextTurn(true);
            if (room.game.currentPlayers.length === 1) {
              this.io.to(roomId).emit('winner', room.game.currentPlayers[0].name);
            } else {
              this.io.to(roomId).emit('startTurn', room.game);
            }
          }
        }
      });
    });
  }

  async init(): Promise<void> {
    this.server.listen(5000);
    console.log('server listening 🌎');
  }
}

export const app = new App();
