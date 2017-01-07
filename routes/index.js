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

function bubble(name){
	this.users = [];
	this.population = 1 ;
}

module.exports = function(io){
  io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      io.sockets.in(msg.room).emit('chat message', people[socket.id].name+': '+msg.message);
    });

    socket.on('room connection', function(channelName){
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
      io.sockets.in(channelName).emit('chat message', people[socket.id].name+' joined '+channelName+'.');
      
	  if(bubbles[channelName] == undefined){
        bubbles[channelName] = new bubble(channelName);
      }else{
        bubbles[channelName].population++;
      }
	  bubbles[channelName].users.push(people[socket.id]);
    });

    socket.on('disconnect', function(){
      if(people[socket.id] != undefined){
		console.log(people[socket.id].name+' disconnected.');
		var room = people[socket.id].room;
		var index = bubbles.indexOf(room);
		if(index != -1){
			array.splice(index, 1);
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

    socket.on('update', function(){
      socket.emit('update', {'bubbles': bubbles});
    });

  });
  return router;
}