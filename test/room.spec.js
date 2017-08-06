'use strict';

const sinon = require('sinon');
const chai = require('chai');
const RoomHandler = require('../bin/room.js');

const expect = chai.expect;

before(function(){
});

describe("Room module", function(){
    var roomHandler = new RoomHandler();

    afterEach(function(){
        roomHandler.rooms.length = 0;
    });

    it("creates a room.", function() {
        roomHandler.createRoom("test", () => {});
        
        expect(roomHandler.rooms.length).to.equal(1);
    });

    it("gets a room.", function(){
        roomHandler.createRoom("test");

        roomHandler.getRoom("test", function(room){
            expect(room.id).to.equal("test");
            expect(room.users.length).to.equal(0);
        });
    });

    it("creates a room if not present.", function(){
        roomHandler.getOrCreateRoom("testroom", function(room){
            expect(room.id).to.equal("testroom");
        });
    });

    it("gets a room with getOrCreateRoom.", function(){
         roomHandler.createRoom("test");

         roomHandler.getOrCreateRoom("test", function(room){
             expect(room.id).to.equal("test");
         });
    });

    it("deletes a room.", function(){
        roomHandler.createRoom("test");
        expect(roomHandler.rooms.length).to.equal(1);
        
        roomHandler.deleteRoom("test", () => {});
        
        expect(roomHandler.rooms.length).to.equal(0);
    })
})