  var socket = io();
  var room = "";
  $(document).ready(function(){
    $('#roomName').text(room);
    $('#chatForm').submit(function(){  
      socket.emit('chat message', {'room': room, 'message': $('#m').val()});
      $('#m').val('');
      return false;
    });

    $('#m').submit(function(){  
      return false;
    });

    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });

    socket.on('room connection', function(channelName){
      room = channelName;
      $('#roomName').text(room);
    });

    $(`#test`).click(function(){
      socket.emit('getPeople');
    });
  });