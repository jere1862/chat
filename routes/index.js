var express = require('express');
var router = express.Router();
var app = require('./../app.js');
var io = require('socket.io')(app);
var moniker = require('moniker');
var people = {};

module.exports = function(io){
  io.on('connection', function(socket){
    socket.on('room connection', function(){
      //Assign a random name
      people[socket.id] = moniker.choose();
      socket.sockets.emit('chat message', 'test');
      //console.log(socket.id+' connected to '+socket.nsp.name+'.');
  });

    socket.on('chat message', function(msg){
      socket.sckets.emit('chat message', people[socket.id]+': '+msg);
    });

    socket.on('room connection', function(channelName){
      socket.join(channelName);
      io.emit('chat message', 'test message');
      //console.log(io.sockets.adapter.rooms[''+channelName]);
      socket.in(channelName).emit('chat message', 'Joined room');
    });

    socket.on('disconnect', function(){
      console.log(people[socket.id]+' disconnected.');
      delete people[socket.id];
    });

    /* GET home page. */
    router.get('/', function(req, res, next) {
      res.render('index', { title: 'Bubble'});
    });

  });
  return router;
}