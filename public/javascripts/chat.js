  var socket = io();
  var username = "";

  $(document).ready(function(){
    document.body.style.overflow = 'hidden';

    $('input[type=submit]').focus();
    $('#roomName').text(roomName);

    socket.emit('chatroom-connection', roomName);

    socket.on("username", function(id){
      username = id;
    });

    $('#chatForm').submit(function(){  
      if($('#m').val()!=''){
        socket.emit('chat message', {'room': roomName, 'message': $('#m').val()});
        $('#m').val('');
      }
      return false;
    });
    
    socket.on('chat message', function(msg){
      // TODO: clean this
      if(msg.name == undefined){
        $('#messages').append($('<li>').text(msg))
      }else{
        var $message = $('<li>');
        if(msg.name === username){
          $message.addClass("alert alert-success modest-message");
        }else{
          $message.addClass("alert alert-info modest-message");
        }
        $('#messages').append($message.text(msg.name+": " + msg.msg));
      }
      $('#messages').append($('<br>'))

     var messageHolder = document.getElementById("message-holder");
     messageHolder.scrollTop = messageHolder.scrollHeight;
     
     messageHolder.onmouseover = function(){
       messageHolder.style.overflowY = 'scroll';
     }

     messageHolder.onmouseleave = function(){
        messageHolder.style.overflowY = 'hidden';
     }
    });

  });