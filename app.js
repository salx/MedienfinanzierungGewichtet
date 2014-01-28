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
	var margin = {top: 100, right: 20, bottom: 20, left: 70},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        half = height/2-1;

    //ordinal scale for medienunternehmen
    var x0 = d3.scale.ordinal()
    	.rangeRoundBands([0, width], 0.2);

    //second x scale for grouping
    var x1 = d3.scale.ordinal();

    //vertikal scale for umsatz und gewinn
    var y0 = d3.scale.linear()
    	.range([half, 0]);

    //second vertikal scale for mitarbeiter
    var y1 = d3.scale.linear()
    	.range([0, half]);

    // color Scale
    var color = d3.scale.ordinal()
    	.range(["#98abc5", "#6b486b"])

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
    	.orient("left")

    var svg = d3.select("body")
    	.append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
    	.append("g")//welchen Sinn macht das, wenn nachher auch noch eine gruppe reinkommt?
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("Medienfinanzierung3.csv", function(error, data){

    	var mediaNames = d3.keys(data[0]).filter( function(key){ return key !== "Unternehmen"; } ); 

    	data.forEach(function(d){
    		d.mediaValues = mediaNames.map(function(name){ return {name: name, value: +d[name]}; }); 
    	});

    	//data.sort(function(a, b){ return b-a; });//wie die Werte angeben...

    	//set the domains
    	x0.domain(data.map(function(d) { return d.Unternehmen } ));
    	x1.domain(mediaNames).rangeRoundBands([0, x0.rangeBand()]); //check
    	
    	function key( name ) {
    		return function(d) {
    			return d[name];
    		}
    	}

    	var umsaetze = data.map( key('mediaValues') ).map( function( d ) { return d[0] } ).map( key( 'value') );
    	var mitarbeiter = data.map( key('mediaValues') ).map( function( d ) { return d[1] } ).map( key( 'value') );
    	y0.domain([0, d3.max(umsaetze)]);
    	y1.domain([0, d3.max(mitarbeiter)])

    	/*
    	svg.append("g")
    		.attr("class", "x axis")
    		.attr("transform", "translate(0," + (height+10) + ")")
    		//.attr("transform", "translate(0,360)")
    		.call(xAxis)
    		.selectAll("text")
    		.style("text-anchor", "end")
    		.attr("transform", "rotate(-90)")
    		.attr("dx", "-0.71em")
			.attr("dy", "-0.31em");
		*/
		

		svg.append( 'line' )
			.attr("class", "line")
			.attr("x0", 0 )
			.attr("x1", width )
			.attr("y1", half )
			.attr("y2", half );

    	svg.append("g")
    		.attr("class", "y axis")
    		.call(yAxis)
    		.append("text")
    		.attr("transform", "rotate(-90)")
    		.attr("y", 6)
    		.attr("dy", "0.71em")
    		.style("text-anchor", "end")
    		.text("Umsatz in Mio. €");

    	svg.append("g")
    		.attr("class", "y axis")
    		.attr('transform', 'translate(0,' + half + ')')
    		.call(yAxis2)
       		.append("text")
    		.attr("transform", "rotate(-90)")
    		.attr("y", 6)
    		.attr("dy", "0.71em")
    		.style("text-anchor", "end")
    		.text("Mitarbeiter");

    	var unternehmen = svg.selectAll(".unternehmen")
    		.data(data)
    		.enter()
    		.append("g")
    		.attr("class", "unternehmen")
    		.attr("transform", function(d){ return "translate(" + x0(d.Unternehmen) + ", 0)" });

    	unternehmen.selectAll("rect")
    		.data(function(d){ return d.mediaValues; })
    		.enter()
    		.append("rect")
    		.attr("width", x0.rangeBand())
    		//.attr("x", function(d){ return x0(d.name); })
    		.attr("y", function(d){ 
    		    if( d.name === 'Mitarbeiter' ) {
                    return half+1;
    		    } else {
    		    	return y0(d.value);
    		    }
    			
    		})
    		.attr("height", function(d){
    		 if( d.name === "Mitarbeiter" ){
    		 	return half - ( half - y1(d.value) )
    		 }
    			return half - y0(d.value)
    		})
    		.attr("fill", function(d){ return color(d.name); });

    	unternehmen.append( 'text' )
    	    .attr( 'class', 'label' )
    	    .attr( 'y', x0.rangeBand() / 2 )
    	    .attr( 'x', function(d) { return 0-y0(d.mediaValues[0].value) +5 })
    	    .attr("text-anchor", "start")
    	    .attr("transform", "rotate(-90)")
    	    .text( function(d) { return d.Unternehmen } );

    })


})();