/***************************************
Authors: Matthew Reilly,Mike Chantler, Mike Bostock
19/11/2018
What it does:
render circle pack

****************************************/

var hierarchyGraph; //The graph of objects used to represent the hierarchy

function pack(targetDOMelement) {
	//Here we use a function declaration to imitate a 'class' definition
	//
	//Invoking the function will return an object (packObject)
	//    e.g. pack_instance = pack(target)
	//    This also has the 'side effect' of appending an svg to the target element
	//
	//The returned object has attached public and private methods (functions in JavaScript)
	//For instance calling method 'updateAndRenderData()' on the returned object
	//(e.g. pack_instance) will render a pack to the svg




	//Delare the main object that will be returned to caller
	var packObject = {};




	//=================== PUBLIC FUNCTIONS =========================
	//


	packObject.loadAndRenderNestDataset = function (nestFormatHierarchy, rootName) {
		//Loads and renders (format 2) hierarchy in "nest" or "key-values" format.
		layoutAndRenderHierarchyInNestFormat(nestFormatHierarchy, rootName)
		return packObject; //for method chaining
	}


	packObject.nodeLabelIfNoKey = function (fn) {
		//Leaf nodes from d3.nest typically have no 'key' property
		//By default the d3.nest 'key' property is used as the node text label
		//If this does not exist the nodeLabelIfNoKey() function will be called to
		// provide the label
		nodeLabelIfNoKey = fn;
		return packObject; //for method chaining
	}
  packObject.appendClickFunction = function (fn) {
    //Instead of overriding the internal click function
    //this will append the invocation of 'fn' to the end of it


    appendClickFunction = fn;
    return packObject; //for method chaining
  }


	//=================== PRIVATE VARIABLES ====================================

	//Declare and append SVG element
	var margin = {top: 20, right: 20, bottom: 20, left: 20},
	width = 600 - margin.right - margin.left,
	height = 500 - margin.top - margin.bottom;

	//Set up SVG and append group to act as container for pack graph
	var grp = d3.select(targetDOMelement).append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Add group for the nodes, just for clarity when 'inspecting' the html & svg
	var nodesGroup = grp
		.append("g")
		.classed("nodesGroup", true);

	//Add group for the links, just for clarity when 'inspecting' the html & svg
	var linksGroup = grp
		.append("g")
		.classed("linksGroup", true);



	//=================== PRIVATE FUNCTIONS ====================================
	var nodeLabelIfNoKey = function(){return "No name set"};
	var appendClickFunction = function(){console.log ("No click fn appended")};
	var clickFunction = function (d,i){console.log("node clicked, d = ",d)
	packClickFunction(d)
	d3.select(this)
	.style('fill', 'orange');
	}
	var nodeLabel = function(d) {return d.data.name + "(height:"+d.height+")";}


	function layoutAndRenderHierarchyInNestFormat (nestFormatHierarchy, rootName){
	//Lays out and renders (format 2) hierarchy in "nest" ("key-values" format).
	console.log(nestFormatHierarchy)
		//Move the 'nest' array into a root node:
		var datasetAsJsonD3Hierarchy = {"key":rootName, "values": nestFormatHierarchy}

		//Now create hierarchy structure
		//Note that we need to add the "children" accessor "d=>d.values" in order
		//to tell d3.hierarchy to use nest's 'values' as children
		hierarchyGraph = d3
			.hierarchy(datasetAsJsonD3Hierarchy, d=>d.values) //
			.sum(d=>d.value) //usually not required for pack (this adds the sum of all descendants' sizes and stores in node.value)
			.sort(function(a, b) { return b.value - a.value; });

		//And we'll use the nest 'keys' as the node labels
		nodeLabel = function(d) {
			if (d.data.key) return d.data.key + "(value:"+ d.value+")";
			else return nodeLabelIfNoKey(d);
		}

		//Can now calculate XY data and render
		calculateXYpositionsAndRender(hierarchyGraph);
	}



	function calculateXYpositionsAndRender(hierarchyGraph){

		//get and setup the pack layout generator
		var mypackLayoutGenerator = d3.pack().size([height, height]);

		//Add x and y properties to each node in the hierarchy graph.
		var hierarchyGraphWithPositions = mypackLayoutGenerator(hierarchyGraph);

		//Get lists of nodes
		var listOfNodes = hierarchyGraphWithPositions.descendants();
        console.log("list of nodes = ", listOfNodes);
		//Render links and nodes
		GUPrenderNodes(listOfNodes);
	}


	function GUPrenderNodes(listOfNodes){

		//DATA BIND

		var selectionGroup = nodesGroup
			.selectAll("g.cssClassNode") //select groups with class = "cssClassNode"
			.data(listOfNodes);

		//ENTER  SELECTION PROCESSING

		//Create groups
		var enterSelectionGroup = selectionGroup
			.enter()
			.append("g")
			.attr("class", d=>{if(d.data.key) return "nest-key--"+d.data.key.replace(/[\W]+/g,"_"); else return "No key";})
			.classed("cssClassNode enterSelection", true)

		enterSelectionGroup
		.append("circle")
		.attr("r", function(d) {console.log("d=",d);return d.r} );

		enterSelectionGroup
			.on("click", clickFunction)
			.on("mouseover", function(d) {
	      div.transition()
	        .duration(200)
	        .style("opacity", 0.9);
	      div.html(d.data.key + "<br/>" + "Number of Staff: "+d.value)
	        .style("left", (d3.event.pageX) + "px")
	        .style("top", (d3.event.pageY - 28) + "px");
	      })
	    .on("mouseout", function(d) {
	      div.transition()
	        .duration(500)
	        .style("opacity", 0);
	      });
			enterSelectionGroup
				//set appropriate classes for the group
				.classed("leafNode", d => d.height == 0)
				.classed("rootNode", d => d.depth == 0)
				.classed("intermediateNode", d => (d.height != 0 && d.depth != 0));

			enterSelectionGroup
				.attr("transform", function(d) {
					return "translate(" + d.y + "," + d.x + ")";
				});


	//update
		var updateSelection = selectionGroup

		updateSelection.select("circle")
		.attr("r", function(d) {console.log("d=",d);return d.r} );


		updateSelection
			.attr("transform", function(d) {
				return "translate(" + d.y + "," + d.x + ")";
			});

		updateSelection
			//set appropriate classes for the group
			.classed("leafNode", d => d.height == 0)
			.classed("rootNode", d => d.depth == 0)
			.classed("intermediateNode", d => (d.height != 0 && d.depth != 0));

		//Create Merged ENTER + UPDATE selections for the text element in the group

		// EXIT
		var exitSel =selectionGroup
			.exit()
			.classed("enterSelection updateSelection", false)
			.classed("exitSelection", true)
			.remove();
	}







	//================== IMPORTANT do not delete ==================================
	return packObject; // return the main object to the caller to create an instance of the 'class'

} //End of pack() declaration
