/*
Wieso sieht man die X-Ache nicht?
Wie daten auf zweiter Ebene filtern (nur AT, nur Fernsehen bzw: Mitarbeiter und Umsatz trennen)
SORTING
y-Achse: Orientierungslinien - gepunktet/strichliert
Legende
Mouse-Over

Vergleiche DE außerhalb der Grafik?

*/

(function(){
	var margin = {top: 20, right: 20, bottom: 200, left: 70},
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
    var y1 = d3.scale.linear()
    	.range([height, 0]);

    // color Scale
    var color = d3.scale.ordinal()
    	.range(["#98abc5", "#ff8c00"])

    //Axes
    var xAxis = d3.svg.axis()
    	.scale(x0)
    	.orient("bottom");

    var yAxis = d3.svg.axis()
    	.scale(y0)
    	.orient("left")
    	//.tickFormat(d3.format(".2s"));//welche Argumente nimmt .format - versteh ich so nicht, Ausgabe ist in Mio.

    var yAxis2 = d3.svg.axis()
    	.scale(y1)
    	.orient("right")

    var svg = d3.select("body")
    	.append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
    	.append("g")//welchen Sinn macht das, wenn nachher auch noch eine gruppe reinkommt?
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("Medienfinanzierung2.csv", function(error, data){
    	var mediaNames = d3.keys(data[0]).filter( function(key){ return key !== "Unternehmen"; } ); 

    	data.forEach(function(d){
    		d.mediaValues = mediaNames.map(function(name){ return {name: name, value: +d[name]}; }); 
    	});

    	data.sort(function(a, b){ return b-a; });//wie die Werte angeben...

    	//set the domains
    	x0.domain(data.map(function(d) { return d.Unternehmen } ));
    	x1.domain(mediaNames).rangeRoundBands([0, x0.rangeBand()]); //check
    	y0.domain([0, d3.max(data, function(d) { return d3.max(d.mediaValues, function(d){ return d.value }); })]);
    	//y1.domain()

    	svg.append("g")
    		.attr("class", "x axis")
    		.attr("transform", "translate(-12," + (height + 7)+ ")")
    		//.attr("transform", "translate(0,360)")
    		.call(xAxis)
    		.selectAll("text")
    		.style("text-anchor", "end")
    		.attr("transform", "rotate(-90)")
    		.attr("dx", "-0.71em")
			.attr("dy", "-0.31em");

    	svg.append("g")
    		.attr("class", "y axis")
    		.call(yAxis)
    		.append("text")
    		.attr("transform", "rotate(-90)")
    		.attr("y", 6)
    		.attr("dy", "0.71em")
    		.style("text-anchor", "end")
    		.text("Umsatz in Mio. €");

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
    		.attr("y", function(d){ return y0(d.value); })
    		.attr("height", function(d){ return height - y0(d.value) })
    		.attr("fill", function(d){ return color(d.name); });


    })


})();