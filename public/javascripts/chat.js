  var socket = io();
  var room = "";
  //TODO: Align client name to the right for now 
  $(document).ready(function(){
    $('input[type=submit]').focus();
    $('#roomName').text(room);
    $('#chatForm').submit(function(){  
      if($('#m').val()!=""){
        socket.emit('chat message', {'room': room, 'message': $('#m').val()});
        $('#m').val('');
      }
      return false;
    });
    
    socket.on('chat message', function(msg){
      // TODO: clean this
      if(msg.name == undefined){
        $('#messages').append($('<li>').text(msg))
        $('#messages').append($('<br>'))
      }else{
        $('#messages').append($('<li>').text(msg.name+": " + msg.msg).addClass("alert alert-success modest-message"));
        $('#messages').append($('<br>'));
      }

     var messageHolder = document.getElementById("message-holder");
     messageHolder.scrollTop = messageHolder.scrollHeight;  
    });

    socket.on('room connection', function(channelName){
      room = channelName;
      $('#roomName').text(room);
      console.log("aaaa")
    });

    $(`#test`).click(function(){
      socket.emit('getPeople');
    });
  });