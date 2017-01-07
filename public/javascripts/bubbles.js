var socket = io();
var bubbles = [];
$(document).ready(function(){
    socket.on('update', function(channelName){
        console.log(channelName);
		addBubble(channelName);
    });

    $('#btn').click(function(){
        //$('#bubbleHolder').append('<a href=# class="circle"><p class="bubbleText">test</p></a>')
        socket.emit('update');
    });

    $('#btn2').click(function(){
        $('.circle:first').animate({"margin-left": "+=50px"}, 'slow');
    });
});

function bubble(x, y, radius){
	this.x = x;
	this.y = y;
	this.radius = radius;
}

function addBubble(bubble){
	var angle = Math.random()*360;
	//bubbles.push(new bubble(0,0,0));
	$('#bubbleHolder').append('<a href=# class="circle"><p class="bubbleText">test</p></a>');
}