(function(){

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    //ordinal scale for medienunternehmen
    var x = d3.scale.ordinal()
    	.rangeRoundBands([0, width, 0.2]);

    //second x scale for grouping
    var x1 = d3.scale.ordinal();

    //vertikal scale for umsatz und gewinn
    var y = d3.scale.linear()
    	.range([height, 0]);

    //second vertikal scale for mitarbeiter
    //this I have to think about

    // color Scale
    var color = d3.scale.ordinal()
    	.rande(["#98abc5", "#6b486b", "#ff8c00"])

    //Axes
    var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom");

    var yAxis = d3.svg.axis()
    	.scale(y)
    	.orient("left")
    	.tickFormat(".2s");//welche Argumente nimmt .format - versteh ich so nicht, Ausgabe ist in Mio.

    var svg = d3.select("body")
    	.append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
    	.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.csv("Medienfinanzierung2.csv", function(error, data){
    	var mediaNames = 

    })


})