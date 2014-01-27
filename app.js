(function(){

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    //ordinal scale for medienunternehmen
    var x0 = d3.scale.ordinal()
    	.rangeRoundBands([0, width, 0.2]);

    //second x scale for grouping
    var x1 = d3.scale.ordinal();

    //vertikal scale for umsatz und gewinn
    var y0 = d3.scale.linear()
    	.range([height, 0]);

    //second vertikal scale for mitarbeiter
    //this I have to think about
    //y1 = 

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

    var svg = d3.select("body")//wieso wird das nicht ausgeführt??
    	.append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
    	.append("g")//welchen Sinn macht das, wenn nachher auch noch eine gruppe reinkommt?
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.csv("Medienfinanzierung2.csv", function(error, data){
    	var mediaNames = d3.keys(data[0]).filter( function(key){ return key !== "Unternehmen"; } ); 

    	data.forEach(function(d){
    		d.mediaValues = mediaNames.map(function(name){ return {name: name, value: +d[name]}; }); 
    	});

    	//set the domains
    	x0.domain(data.map(function(d) { return d.Unternehmen } ));
    	x1.domain(mediaNames).rangeRoundBands([0, x0.rangeBand()]); //check
    	y0.domain([0, d3.max(data, function(d) { return d3.max(d.mediaValues, function(d){ return d.value }); })]);
    	//y1.domain()

    	svg.append("g")
    		.attr("class", "x axis")
    		.attr("transform", "translate(0," + height + ")")
    		.call(xAxis);

    	svg.append("g")
    		.attr("class", "y axis")
    		.call(yAxis)
    		.append("text")
    		.attr("transform", "rotate(-90)")
    		.attr("y", 6)
    		.attr("dy", "0.71em")
    		.style("text-anchor", "end")
    		.text("Umsatz in Mio. Euro");

    	var unternehmen = svg.selectAll(".unternehmen")
    		.data(data)
    		.enter().
    		append("g")
    		.attr("class", "g")
    		.attr("transform", function(d){ return "translate(" + x0(d.Unternehmen) + ", 0)" });

    	unternehmen.selectAll("rect")
    		.data(function(d){ return d.mediaValues; })
    		.enter()
    		.append("rect")
    		.attr("width", x1.rangeBand())
    		.attr("x", function(d){ return x1(d.name); })
    		.attr("y", function(d){ return y(d.value); })
    		.attr("height", function(d){ return height - y(d.value) })
    		.attr("fill", function(d){ return color(d.name); });


    })


})