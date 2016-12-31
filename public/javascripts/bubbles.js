var socket = io();
$(document).ready(function(){
    socket.on('update', function(channelName){
        console.log(channelName);
    });

    $('#btn').click(function(){
        $('#bubbleHolder').append('<a href=# class="circle"><p class="bubbleText">test</p></a>')
        //socket.emit('update');
    });

    $('#btn2').click(function(){
        $('.circle:first').animate({"left": "+=50px"}, 'slow');
    });
});