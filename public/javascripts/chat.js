  var socket = io();
  var room = "";
  $(document).ready(function(){
    $('input[type=submit]').focus();
    $('#roomName').text(room);
    $('#chatForm').submit(function(){  
      if($('#m').val()!=""){
        socket.emit('chat message', {'room': room, 'message': $('#m').val()});
        $('#m').val('');
        return false;
      }
      return false;
    });
    
    socket.on('chat message', function(msg){
      if(msg.name == undefined){
        $('#messages').append($('<li>').text(msg))
        $('#messages').append($('<br>'))
      }else{
        $('#messages').append($('<span>').text(msg.name+": ").addClass("alert alert-success"));
        $('#messages').append($('<li>').text(msg.msg).addClass("alert alert-success"));
      }

      //TODO: 
      document.getElementById("chat-panel").scrollTop = document.getElementById("chat-panel").scrollHeight
    });

    socket.on('room connection', function(channelName){
      room = channelName;
      $('#roomName').text(room);
    });

    $(`#test`).click(function(){
      socket.emit('getPeople');
    });
  });