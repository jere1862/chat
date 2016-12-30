  var socket = io();
  $(document).ready(function(){

    $('#channelConnect').submit(function(){
      socket.emit('room connection', $('#channelConnectName').val());
      $('#channelConnectName').val('');
      return false;
    });

    $('#chatForm').submit(function(){  
      socket.emit('chat message', $('#m').val());
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

  });