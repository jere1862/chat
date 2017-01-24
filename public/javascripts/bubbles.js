var socket = io();
var placedBubbles = [];
const CLOSE_IN_DISTANCE = 150;

$(document).ready(function(){
    socket.emit('update');
    socket.on('update', function(update){
        placedBubbles = [];
		addBubbles(update);
        for(var i = 0; i < 10; i++){
            bringBubblesTogether();
        }
        animate();
    });
});

function bubbleFunct(name, x, y, radius){
    this.name = name;
	this.position = {'x': x, 'y': y};
    this.nextPosition = {'x': x, 'y': y};
	this.radius = radius;
}

function addBubbles(bubblesToAdd){
    var newBubbles = {};
    for(bubbleToAdd in bubblesToAdd){
        // TODO radius non constant
        var newBubble = new bubbleFunct(bubblesToAdd[bubbleToAdd].name, 0, 0, 30);
        newBubbles[bubbleToAdd] = newBubble;
        var position = calculateNextPosition(30);
        if(position == -1){
            console.log('Couldn\'t find a place for a bubble');
        }else{
            newBubbles[bubbleToAdd].position = position;
            // TODO: figure out why favicon gets added as a bubble
            if(newBubbles[bubbleToAdd].name!=""&&newBubbles[bubbleToAdd].name!=undefined&&newBubbles[bubbleToAdd].name!="favicon.ico/"){     
                place(newBubbles[bubbleToAdd]);
            }
        }
    }
}

function calculateNextPosition(radius){
    // On essaie 5 fois pour l'instant
    if(placedBubbles.length==0){
        return {'x': 600-radius, 'y': 400-radius}
    }
    for(var i = 0; i < 5; i++){
        // Constantes pour l'instant, trouver un moyen de faire ça en pourcentage
        var x = Math.random()*1200;
        var y = Math.random()*800;
        for(bubble in placedBubbles){
            var distX = placedBubbles[bubble].position.x-x;
            var distY = placedBubbles[bubble].position.y-y;
            if(Math.abs(distX) >= (placedBubbles[bubble].radius + radius) && Math.abs(distY) >= (placedBubbles[bubble].radius+radius)){
                return {'x':x, 'y':y};
            }
        }
    }
    return -1;
}

function place(bubble){
    $("<style>")
    .prop("type", "text/css")
    .html("\
    #"+bubble.name+" {\
        margin-top:"+bubble.position.y+"px;\
        margin-left:"+bubble.position.x+"px;\
    }")
    .appendTo("head");
	$('#bubbleHolder').append('<a href=/'+bubble.name+' class="circle" id="'+bubble.name+'"><p class="bubbleText">'+bubble.name+'/</p></a>');
    placedBubbles.push(bubble);
}

function bringBubblesTogether(){
     for(bubble in placedBubbles){
         console.log(placedBubbles);
            var xOrientation = 1;
            var yOrientation = 1;
            if(placedBubbles[bubble].position.x > placedBubbles[0].position.x){
                xOrientation = -1;
            }
            if(placedBubbles[bubble].position.y > placedBubbles[0].position.y){
                yOrientation = -1;
            }
            var newDistX = placedBubbles[bubble].position.x + (xOrientation*CLOSE_IN_DISTANCE);
            var newDistY = placedBubbles[bubble].position.y + (yOrientation*CLOSE_IN_DISTANCE);
            if(!checkCollisions(placedBubbles[bubble])){
                placedBubbles[bubble].nextPosition.x = newDistX;
                placedBubbles[bubble].nextPosition.y = newDistY;
            }
     }
}

function animate(){
     for(bubbleToAnimate in placedBubbles){
        var newX = placedBubbles[bubbleToAnimate].nextPosition.x -  placedBubbles[bubbleToAnimate].position.x;
        var newY = placedBubbles[bubbleToAnimate].nextPosition.y - placedBubbles[bubbleToAnimate].position.y;
        var bubbleToAnimateId = '#'+placedBubbles[bubbleToAnimate].name;
        console.log(bubbleToAnimateId);
        $(bubbleToAnimateId).animate({"margin-top": "+="+newY, "margin-left": "+=" +newX}, 2000);
     }
     for(bubbleToAnimate in placedBubbles){
         console.log(placedBubbles[bubbleToAnimate]);
     }
}

function checkCollisions(positionToCheck){
    //Regarder avec toutes les autres, il faudrait faire excepté la même
    for(placedBubble in placedBubbles){
        var distX = placedBubbles[bubble].nextPosition.x-positionToCheck.position.x;
        var distY = placedBubbles[bubble].nextPosition.y-positionToCheck.position.y;
        console.log(distX);
        var radius = positionToCheck.radius;
         if(Math.abs(distX) < (placedBubbles[placedBubble].radius + radius) && Math.abs(distY) < (placedBubbles[placedBubble].radius+radius)){
            return true;
        }
    return false;
    }
}