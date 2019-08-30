/***************************************
Authors: Matthew Reilly, Mike Bostock
19/11/2018
What it does:
renders force-directed diagram

****************************************/


function force(targetDOMelement) {

var forceObject = {};
var target = targetDOMelement;

//clear all topic with below 2%.
clearZero = function(obj){
  var size = 0,key;
  for(key in obj){
      if (obj[key] <= 0.02) delete obj[key];
  }
  return obj;
};
//get size of object
Object.size = function(obj) {
      var size = 0, key;
      for (key in obj) {
        console.log(key);
          if (obj.hasOwnProperty(key)) size++;
      }
      return size;
  };

forceObject.loadAndRenderDataset = function (data) {

    layoutAndRenderData(data);
    return forceObject;
  };


  var width = 400,
      height = 400,
      maxRadius = 150;
var   enternode,updatenode,exitnode
var nodes = []
    color = d3.scaleOrdinal(d3.schemeCategory10);
    // Get the size of an object


    var simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-300))
        .force("forceX", d3.forceX().strength(.1))
        .force("forceY", d3.forceY().strength(.1))
        .force("center", d3.forceCenter())
        .alphaTarget(1)
        .on("tick", ticked);

    var svg = d3.select(targetDOMelement).append("svg").attr("width", width).attr("height", height).classed("force",true)
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),
        node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");



    function layoutAndRenderData(data) {

  getData(data)
      // transition
      var t = d3.transition()
          .duration(750);

      // Apply the general update pattern to the nodes.
      node = node.data(nodes, function(d) { return d.name;});
      //exit
      node.exit()
      .classed("updateSelection enterSelection", false)
      .classed("exitSelection", true)
      .transition(t)
          .attr("r", 0)
          .remove();
//update
      node
      .classed("updateSelection", true)
      .classed("enterSelection exitSelection", false)
          .transition(t).delay(750)
            .attr("r", function(d){ return d.radius; });
//enter
      node = node.enter().append("circle")
          .classed("force enterSelection", true)
          .attr("r", function(d){ return d.radius })
          .on("mouseover", function(d) {
    	      div.transition()
    	        .duration(200)
    	        .style("opacity", 0.9);
    	      div.html(d.name + "<br/>" + "Similarity: "+((d.radius/maxRadius)*100)+"%")
    	        .style("left", (d3.event.pageX) + "px")
    	        .style("top", (d3.event.pageY - 28) + "px");
    	      })
    	    .on("mouseout", function(d) {
    	      div.transition()
    	        .duration(500)
    	        .style("opacity", 0);
    	      })
          .merge(node);

      // Update and restart the simulation.
      simulation.nodes(nodes)
        .force("collide", d3.forceCollide().strength(1).radius(function(d){ return d.radius+1; }).iterations(1));

    }
//every tick
    function ticked() {
      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })

    }




//convert the data into nodes.
function getData(data){
  data = clearZero(data);
  var size = Object.size(data);
  keys = Object.keys(data);
  var c =0;
  var name = new Array(size);
  nodes = d3.range(size).map(function() {
    var i = keys[c],
        r = data[keys[c]] * maxRadius,
        d = {name: i, radius: r};
        c++;
    return d;
  });
  console.log(nodes)
}


return forceObject;
}
