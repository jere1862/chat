  var socket = io();
  var username = "";

  //TODO: Align client name to the right for now 
  $(document).ready(function(){
    document.body.style.overflow = 'hidden';
    //$('#message-holder').style.overflow = 'hidden';

    $('input[type=submit]').focus();
    $('#roomName').text(roomName);

    socket.emit('chatroom-connection', roomName);

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
        $('#messages').append($('<li>').text(msg.name+": " + msg.msg).addClass("alert alert-success modest-message"));
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