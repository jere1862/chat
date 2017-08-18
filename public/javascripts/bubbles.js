$(document).ready(function(){
    var socket = io();
    const MAX_BUBBLE_RADIUS = 100;

    var bubblesHierarchy = {
        "name": "default",
        "children": [
        ]
    }

    window.onresize = function(){
        var svg = d3.select("svg");
        svg.remove();
        drawSvg();
    };

    socket.emit("bubblesUpdate");

    socket.on("bubblesUpdate", function(res){
        var bubbles = [];
        res.forEach(function(bubble){
            bubbles.push({
                "name": bubble.id,
                "value": bubble.users.length
            });
        });
        bubbles.push({
            "name": "Create bubble",
            "type": "createBubble",
            "value": 1
        });
        bubblesHierarchy.children = bubbles;
        drawSvg()
    });

    function drawSvg(){
        if(bubblesHierarchy.children.length==0) return;
        var svg = d3.selectAll("body").append("svg")
            .attr("width", window.innerWidth)
            .attr("height", window.innerHeight)
            .attr("font-family", "sans-serif")
            .attr("font-size", "10")
            .attr("text-anchor", "middle");

        width = +svg.attr("width"),
        height = +svg.attr("height");

        var pack = d3.pack()
            .size([width, height]);
        var color = d3.scaleOrdinal(d3.schemeCategory20);

        var root = d3.hierarchy(bubblesHierarchy)
            .sum(function(d) { return d.value; })
            .each(function(d) {
                d.id = d.data.name;
            });

        var node = svg.selectAll(".node")
            .data(pack(root).leaves())
            .enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                .attr("cursor", "pointer");

        node.append("circle")
            .attr("id", function(d) { return d.name;})
            .attr("r", function(d) {
                 if(d.r > MAX_BUBBLE_RADIUS && bubblesHierarchy.children.length == 1){
                    return MAX_BUBBLE_RADIUS;
                 }
                 return d.r;
             })
            .style("fill", function(d) {
                return color(d.value); 
            })
            .attr("class", function(d) {
                if(d.data.type === undefined){
                    return "default";
                }
                return d.data.type;
            })
            .style("stroke", "black")
            .style("stroke-width", "3px");
        
        node.append("clipPath")
            .attr("id", function(d) { return "clip-" + d.id; })
            .append("use")
            .attr("xlink:href", function(d) { return "#" + d.id; }); 

        node.append("text")
            .selectAll("tspan")
                .data(function(d) {return d.id.split(/(?=[A-Z][^A-Z])/g); })
                .enter().append("tspan")
                    .text(function(d) { return d })
                    .attr("x", 0)
                    .attr("y", 0)
                    .style("font-size", "1px")
                    .attr("class", "unselectable")
                    .each(getSize)
                    .style("font-size", function() { return this.scale + "px"; })
                .on("click", function(text){
                    if(text == "Create bubble"){
                        openCreateBubbleDialog();
                        return false;
                    }
                    window.location.href = "/" + text;
                    return false;
                })
        
        var defaultBubbles = d3.selectAll(".default")
            .on("click", function(d) {
                window.location.href = "/"+d.id;
                return false;        
            })

        var createBubbleButton = d3.select(".createBubble")
            .attr("stroke-dasharray", "10,10")
            .attr("href", "#")
            .on("click", function(){
                openCreateBubbleDialog();
            });
        }
});

function getSize(){
    var boundingBox = this.getBBox(),
    circleBoundingBox = this.parentNode.parentNode.getBBox(),
    scale = Math.min(circleBoundingBox.width / boundingBox.width, circleBoundingBox.height / boundingBox.height);
    this.scale = scale;
}

function openCreateBubbleDialog(){
    var test = BootstrapDialog.show({
        title: 'Create a bubble',
        id: "create-bubble-modal",
        message: $('<input class="form-control" placeholder="Enter a bubble name..."></input>'),
        onshown: function(dialogRef){
            var input = $("input.form-control"); 
            input.focus();
            input.keypress(function(e){
                if(e.which == 13){
                    if(!inputIsValid(input.val())){
                        if(!$('#wrong-input-alert').length){
                            $('<div id="wrong-input-alert" class="alert alert-danger" role="alert">Bubble name is invalid.</div>').insertBefore(input);
                            return false;
                        }
                        return false;
                    }
                    window.location.href = "/"+input.val();
                    return false;
                }
            });  
        }
    });        
}

function inputIsValid(input){
    var regex = /^.*[a-zA-Z].*[a-zA-Z ]*$/;
    if(input.length == 0 || input.length > 25){
        return false;
    }
    return regex.test(input);
}

