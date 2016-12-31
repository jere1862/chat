  var socket = io();
  var room = "General";
  $(document).ready(function(){
    socket.emit('room connection', room);
    $('#roomName').text(room);
    $('#channelConnect').submit(function(){
      socket.emit('room connection', $('#channelConnectName').val());
      $('#channelConnectName').val('');
      return false;
    });

    $('#chatForm').submit(function(){  
      socket.emit('chat message', {'room': room, 'message': $('#m').val()});
      $('#m').val('');
      return false;
    });

    $('#channelForm').submit(function(){
      socket.emit('channel creation', $('#channelName').val());
      $('#channelName').val('');
      return false;
    });

    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });

    socket.on('room connection', function(channelName){
      room = channelName;
      $('#roomName').text(room);
    });

  });