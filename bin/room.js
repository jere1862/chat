'use strict';

var _ = require('underscore');

var RoomHandler = function(){
    this.rooms = [];
}

RoomHandler.prototype = {
    createRoom: function(id, callback){
        var room = new Room(id);
        this.rooms.push(room);
        console.log("inCreateRoom");
        return room;
    },
    getRoom: function(id, callback){
        findRoomById(this.rooms, id, callback);
    },
    deleteRoom: function(id, callback){
        var self = this;
        innerDeleteRoom(self.rooms, id, function(rooms){
            self.rooms = rooms;
            callback();
        });
    }
};

function findRoomById(rooms, roomId, callback){
    callback(_.findWhere(rooms, {id: roomId}));
}

function innerDeleteRoom(rooms, roomId, callback){
    callback(_.filter(rooms, function(room){
        return room.id !== roomId;
    }));
}

var Room = function(id){
    this.id = id;
    this.users = [];
};

Room.prototype = {
    addUser: function(user){
        this.users.push(user);
    }
};

module.exports = RoomHandler;
