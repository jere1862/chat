var express = require('express');
var router = express.Router();
var app = require('./../app.js');
var io = require('socket.io')(app);
var moniker = require('moniker');
var RoomHandler = require('../bin/room');
var people = {};

function User(name, room){
	this.name = name;
	this.room = room;
}

module.exports = function(io){
  var roomHandler = new RoomHandler();
  io.on('connection', function(socket){

    socket.on('chatroom-connection', function(room){
        connectToRoom(room, function(id){});
    });

    socket.on('chat message', function(msg){
        message = {
          "name": people[socket.id].name,
          "msg": msg.message
        }
        io.sockets.in(msg.room).emit('chat message', message);
    });
  
    function connectToRoom(channelName, callback){
      if(people[socket.id]==undefined){
        people[socket.id] = new User(moniker.choose(), channelName);
      }else{
        people[socket.id].room = channelName;
      }
      
      socket.join(channelName);
      socket.emit('room connection', channelName);
      io.sockets.in(channelName).emit('chat message', people[socket.id].name+' joined.');

      roomHandler.getOrCreateRoom(channelName, function(room){
        room.addUser(people[socket.id]);
      });
      
      callback(socket.id);
    }

    socket.on('room connection', function(channelName){
      connectToRoom(channelName);
    });

    socket.on('disconnect', function(){
      // TODO: verify room is left
      /*if(people[socket.id] != undefined){
        console.log(people[socket.id].name+' disconnected.');
        for(bubble in bubbles){
          if(bubble == people[socket.id].room){
            bubble.population--;
            delete bubbles[bubble].users[people[socket.id]];
          }
        }
        delete people[socket.id];
      }*/
    });

   /* Bubble homepage */

   /* GET home page. */
    router.get('/', function(req, res, next) {
      res.render('home', { bubbles: roomHandler.rooms });
    });

    router.get('/:roomname', function(req, res, next){
      res.render('index', {'title': req.params.roomname}, 
      connectToRoom(req.params.roomname, function(){}));
    });

    socket.on('update', function(){
      socket.emit('update', roomHandler.rooms );
    });
  });
  return router;
}