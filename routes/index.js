var express = require('express');
var router = express.Router();
var app = require('./../app.js');
var io = require('socket.io')(app);
var moniker = require('moniker');
var people = {};
var bubbles = {};

function person(name, room){
	this.name = name;
	this.room = room;
}

module.exports = function(io){

  io.on('connection', function(socket){

    socket.on('chat message', function(msg){
      if(people[socket.id]==undefined){
        connectToRoom(msg.room ,function(id){
          io.sockets.in(msg.room).emit('chat message', people[id].name+': '+msg.message);
        });
      }else{
        io.sockets.in(msg.room).emit('chat message', people[socket.id].name+': '+msg.message);
      }
    });

    function bubble(name){
      this.name = name;
      this.users = [];
      this.population = 1 ;
    }

    function connectToRoom(channelName, callback){
      if(people[socket.id]==undefined){
          // Assign a random name
          people[socket.id] = new person(moniker.choose(), channelName);
        }else{
          var oldRoom = people[socket.id].room;
          bubbles[oldRoom].population--;
          people[socket.id].room = channelName;
        }
        socket.join(channelName);
        socket.emit('room connection', channelName);
        io.sockets.in(channelName).emit('chat message', people[socket.id].name+' joined.');

        if(bubbles[channelName] == undefined){
          bubbles[channelName] = new bubble(channelName);
        }else{
          bubbles[channelName].population++;
        }
        bubbles[channelName].users.push(people[socket.id]);
        callback(socket.id)
      }

    socket.on('room connection', function(channelName){
      connectToRoom(channelName);
    });

    socket.on('disconnect', function(){
      // Todo verifier que la room est leaved
      if(people[socket.id] != undefined){
        console.log(people[socket.id].name+' disconnected.');
        for(bubble in bubbles){
          if(bubble == people[socket.id].room){
            bubble.population--;
            delete bubbles[bubble].users[people[socket.id]];
          }
        }
        delete people[socket.id];
      }
    });

   /* Bubble homepage */

   /* GET home page. */
    router.get('/', function(req, res, next) {
      res.render('home', { bubbles: bubbles });
    });
	
    router.get('/test', function(req, res, next) {
      res.render('index', {'title': 'test'})
    });

    router.get('/:roomname', function(req, res, next){
      res.render('index', {'title': req.params.roomname}, 
      connectToRoom(req.params.roomname, function(){}));
    });

    socket.on('update', function(){
      socket.emit('update', bubbles);
    });
  });
  return router;
}