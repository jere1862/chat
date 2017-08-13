$(document).ready(function(){
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var pack = d3.pack()
        .size([width, height])
        .padding(1.5);

    var format = d3.format(",d");

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var hierarchy = {
        "name": "Eve",
        "value": 12,
        "children": [
            {
            "name": "Cain",
            "value": 20,
            },
            {
            "name": "Seth",
            "value": 100,
            "children": [
                {
                "name": "Enos",
                "value": 15
                },
                {
                "name": "Noam",
                "value": 150
                }
            ]
            },
            {
            "name": "Abel",
            "value": 4
            },
            {
            "name": "Awan",
            "value": 24,
            "children": [
                {
                "name": "Enoch",
                "value": 4
                }
            ]
            },
            {
            "name": "Azura",
            "value": 16
            }
        ]
    };

    var root = d3.hierarchy(hierarchy)
        .sum(function(d) { return d.value; })
        .each(function(d) {
            d.id = d.data.name;
        });

    var node = svg.selectAll(".node")
        .data(pack(root).leaves())
        .enter().append("a")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .attr("href", "#")
    
    node.append("circle")
        .attr("id", function(d) { return d.name;})
        .attr("r", function(d) { return d.r;})
        .style("fill", function(d) { return color(d.value); })
        .style("stroke", "black")
        .style("stroke-width", "2px")

    node.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.id; })
        .append("use")
        .attr("xlink:href", function(d) { return "#" + d.id; }); 

    node.append("text")
        .selectAll("tspan")
        .data(function(d) { return d.id.split(/(?=[A-Z][^A-Z])/g); })
        .enter().append("tspan")
        .text(function(d) { return d })
        .attr("x", 0)
        .attr("y", 0)
        .style("font-size", "1px")
        .attr("class", "unselectable")
        .each(getSize)
        .style("font-size", function() { return this.scale + "px"; })
        .attr("y", function(d, i, nodes){ return 0;})
        //.attr("y", function(d, i, nodes) { return 20 + (i - nodes.length / 2 - 0.5) * 10; });
});

function getSize(){
    var boundingBox = this.getBBox(),
    circleBoundingBox = this.parentNode.parentNode.getBBox(),
    scale = Math.min(circleBoundingBox.width / boundingBox.width, circleBoundingBox.height / boundingBox.height);
    this.scale = scale;
}