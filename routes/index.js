var express = require('express');
var router = express.Router();
var app = require('./../app.js');
var io = require('socket.io')(app);
var moniker = require('moniker');
var people = {};
var bubbles = {};

module.exports = function(io){
  io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      io.sockets.in(msg.room).emit('chat message', people[socket.id]+': '+msg.message);
    });

    socket.on('room connection', function(channelName){
      if(people[socket.id]==undefined){
        // Assign a random name
        people[socket.id] = moniker.choose();
      }
      socket.join(channelName);
      socket.emit('room connection', channelName);
      io.sockets.in(channelName).emit('chat message', people[socket.id]+' joined '+channelName+'.');
      if(bubbles[channelName] == undefined){
        bubbles[channelName] = 1;
      }else{
        bubbles[channelName] += 1;
      }
    });

    socket.on('disconnect', function(){
      console.log(people[socket.id]+' disconnected.');
      delete people[socket.id];
    });

   /* Bubble homepage */

   /* GET home page. */
    router.get('/', function(req, res, next) {
      res.render('home', { bubbles: bubbles });
    });

    socket.on('update', function(){
      socket.emit('update', 'testChannel');
    });

  });
  return router;
}