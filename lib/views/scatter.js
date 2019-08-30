/***************************************
Authors: Matthew Reilly, Mike Chantler
19/11/2018
What it does:
rneders scatterplot

****************************************/
"use safe"

function scatterplot(targetDOMelement) {
	//Here we use a function declaration to imitate a 'class' definition
	//
	//Invoking the function will return an object (scatterplotObject)
	//    e.g. scatterplot_instance = scatterplot(target)
	//    This also has the 'side effect' of appending an svg to the target element
	//
	//The returned object has attached public and private methods (functions in JavaScript)
	//For instance calling method 'updateAndRenderData()' on the returned object
	//(e.g. scatterplot_instance) will render a scatterplot to the svg


	//Delare the main object that will be returned to caller
	var scatterplotObject = {};

	//=================== PUBLIC FUNCTIONS =========================
	//



  scatterplotObject.appendedClickFunction = function (callbackFunction) {
    appendClickFunction = callbackFunction;
    return scatterplotObject;
  }


  scatterplotObject.appendedMouseOverFunction = function (callbackFunction) {
		console.log("appendedMouseOverFunction called", callbackFunction)
		appendedMouseOverFunction = callbackFunction;
		return scatterplotObject;
	}

	scatterplotObject.appendedMouseOutFunction = function (callbackFunction) {
		appendedMouseOutFunction = callbackFunction;
		return scatterplotObject;
	}

	scatterplotObject.loadAndRenderDataset = function (data) {
		dataset=data.map(d=>d)
		GUP_bars();
		return scatterplotObject;
	}

	scatterplotObject.overrideMouseoverFunction = function (callbackFunction) {
		mouseoverCallback = callbackFunction;
		return scatterplotObject;
	}

	scatterplotObject.overrideMouseoutFunction = function (callbackFunction) {
		mouseoutCallback = callbackFunction;
		return scatterplotObject;
	}

	scatterplotObject.overrideDataFieldFunction = function (dataFieldFunction) {
		dataField = dataFieldFunction;
		return scatterplotObject;
	}

  scatterplotObject.overrideKeyFunction = function (keyFunction) {
    //The key function is used to obtain keys for GUP rendering and
    //to provide the categories for the y-axis
    //These valuse should be unique
    GUPkeyField = yAxisCategoryFunction = keyFunction;
    return scatterplotObject;
  }

	//=================== PRIVATE VARIABLES ====================================
	//Width and height of svg canvas
	var svgWidth = 900;
	var svgHeight = 500;
	var dataset = [];


	//=================== INITIALISATION CODE ====================================

	//Declare and append SVG element
	var svg = d3
		.select(targetDOMelement)
		.append("svg")
		.attr("width", svgWidth)
		.attr("height", svgHeight)
		.classed("scatterplot",true);

	//===================== PRIVATE FUNCTIONS =========================================

	var dataField = function(d){return d.dataField} //The length of the bars
  var yAxisCategoryFunction = function(d){return d.UoAString} //Categories for y-axis
  var GUPkeyField = yAxisCategoryFunction;
	var mouseoverCallback = function(d){
		d.highlight = true;
		GUP_bars();
	}




	var mouseoutCallback = function(d){
		d.highlight =false;
		GUP_bars();
	}


  var appendedMouseOutFunction = function(){};

  var appendedMouseOverFunction = function(d){};

  var mouseOverFunction = function (d,i){
        d3.select(this).classed("highlight", true).classed("noHighlight", false);
    appendedMouseOverFunction(d,i);
  }

  var mouseOutFunction = function (d,i){
        d3.select(this).classed("highlight", false).classed("noHighlight", true);
    appendedMouseOutFunction(d,i);
  }
  var appendedClickFunction = function (d,i){
        console.log("scatter click function = nothing at the moment, d=",d)
	};


	var GUP_bars = function(){
		//GUP = General Update Pattern to render bars


  var selection = svg
    .selectAll(".scatter")
    .data(dataset,GUPkeyField);


   //GUP: ENTER SELECTION
  var enterSel = selection //Create DOM rectangles, positioned @ x=yAxisIndent
    .enter()
    .append("circle")


  enterSel //Add CSS classes
  .attr("class", (d=>"key--"+d["Institution name"].replace(/[\W]+/g,"_")))
    .classed("scatter enterSelection", true)
    .classed("highlight", d=>d.highlight)

  enterSel 
    .transition()
    .duration(1000)
    .delay(2000)
    .attr("r", 8)
    .attr("cx", function(d) { return (10+d.environment["4*"]*8); })
    .attr("cy", function(d) { return (10+d.environment.WordCount/25); })

    enterSel
  		.on("mouseover", mouseOverFunction)
  		.on("mouseout", mouseOutFunction)
  		.on("click", appendClickFunction)


  //GUP UPDATE (anything that is already on the page)
  var updateSel = selection //update CSS classes
    .classed("noHighlight updateSelection", true)
    .classed("highlight enterSelection exitSelection", false)
    .classed("highlight", d=>d.highlight)

  updateSel	//update bars
    .transition()
    .duration(1000)
    .delay(1000)
    .attr("r", 5)
    .attr("cx", function(d) { return (10+d.environment["4*"]*8); })
    .attr("cy", function(d) { return (10+d.environment.WordCount/25); })

    updateSel
  		.on("mouseover", mouseOverFunction)
  		.on("mouseout", mouseOutFunction)
  		.on("click", appendClickFunction)




  //GUP EXIT selection
  var exitSel = selection.exit()
    .classed("highlight updateSelection enterSelection", false)
    .classed("exitSelection", true)

      .attr("r",0)
      .remove()
};



	//================== IMPORTANT do not delete ==================================
	return scatterplotObject; // return the main object to the caller to create an instance of the 'class'

} //End of scatterplot() declaration
