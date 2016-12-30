var express = require('express');
var router = express.Router();
var app = require('./../app.js');
var io = require('socket.io')(app);

module.exports = function(io){
  /* GET users listing. */
  router.get('/', function(req, res, next) {
    console.log(io.sockets.ids)
    res.send('respond with a resource');
  });
  return router;
}
