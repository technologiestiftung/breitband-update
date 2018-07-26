//TODO: Change to Canvas for performance

/*global d3:false */
/*jshint unused:false*/
/* eslint-disable */
function d3_correlation(_geo_data){
	var selection,
		width = 300,
		height = 100,
		padding = 10,
		svg,
		data = _geo_data,
    	colors = [{r:189,g:0,b:38,a:0.8},{r:240,g:59,b:32,a:0.8},{r:253,g:141,b:60,a:0.8},{r:254,g:204,b:92,a:0.8},{r:255,g:255,b:178,a:0.8}],
    	percentage_domain = [100, 95, 75, 50, 10],
    	color_scale = d3.scale.linear()
    		.domain(percentage_domain)
    		.range(colors),
    	x = d3.scale.linear().range([0,(width-2*padding)]), 
    	barWidth, 
    	theight = (height-2*padding),
    	y = d3.scale.linear().domain(percentage_domain).range([theight, theight*0.95, theight*0.75, theight*0.5, theight*0.1]);

	function correlation(sel){
		selection = sel;
		x.domain([0,data.length]);
		barWidth = (width-2*padding)/data.length;
		correlation.init();
	}

	correlation.init = function(){
		selection.each(function() {
			var sel = d3.select(this);

			svg = sel.append('svg')
				.attr('viewBox', '0 0 '+width+' '+height)
				.attr('preserveAspectRatio', 'xMidYMid meet')
				.append('g')
					.attr('transform','translate('+padding+','+padding+')');

			var speed = sel.attr('data-speed'),
				type = sel.attr('data-type');

			var tdata = data.sort(function(a,b){
				if(a.properties[type] == b.properties[type]){
					return a.properties[speed] - b.properties[speed]
				}
				return a.properties[type] - b.properties[type];
			});

			svg.selectAll('rect').data(tdata).enter().append("rect")
				.style('stroke', 'transparent')
				.style('fill',function(d){
					var color = color_scale(d.properties[speed]);
					return 'rgb('+Math.round(color.r)+','+Math.round(color.g)+','+Math.round(color.b)+')';
				})
				.attr("x", function(d,i){
					return x(i);
				})
				.attr("width", barWidth)
				.attr("height", function(d){
					return y(d.properties[speed]);
				})
				.attr("y", function(d){
					return height-2*padding-y(d.properties[speed]);
				});

			
			if(type == 'dist' || type == 'population'){
				correlation.trendline(tdata, speed, svg, 0, tdata.length-1);
			}else{

				([0,1,2]).forEach(function(keyValue){
					var trenddata = [], start = false, end = 0;
					tdata.forEach(function(d,di){
						if(d.properties[type] == keyValue){
							trenddata.push(d);
							if(end<di){end = di;}
							if(!start){
								start = di;
							}
						}
					});
					correlation.trendline(trenddata, speed, svg, start, end);
				});

			}
			
		});

		//svg.append('text').text(year).attr('x',width/2).attr('y',height/2+130).attr('text-anchor', 'middle');

		correlation.resize();
	};

	correlation.trendline = function(tdata, speed, svg, start, end) {
		var xSeries = d3.range(1, tdata.length + 1);
		var ySeries = data.map(function(d) { return parseFloat(d.properties[speed]); });
	
		var leastSquaresCoeff = leastSquares(xSeries, ySeries);
	
		// apply the reults of the least squares regression
		var x1 = start;
		var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
		var x2 = end;
		var y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
		var trendData = [x1,y1,x2,y2];


		var trendline = svg.append("line").datum(trendData)
				.attr("class", "trendline")
				.attr("x1", function(d) { return x(d[0]); })
				.attr("y1", function(d) { return height-y(d[1]); })
				.attr("x2", function(d) { return x(d[2]); })
				.attr("y2", function(d) { return height-y(d[3]); })
				.attr("stroke", "black")
				.attr("stroke-width", 1);
	};

	correlation.resize = function(){
		var sel = d3.select('.correlation');
		var bb = sel.node().getBoundingClientRect();
		width = bb.width;
		height = width/3;
		svg.style('height', height+'px');
	};

	// returns slope, intercept and r-square of the line
	function leastSquares(xSeries, ySeries) {
		var reduceSumFunc = function(prev, cur) { return prev + cur; };
		
		var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
		var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

		var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
			.reduce(reduceSumFunc);
		
		var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
			.reduce(reduceSumFunc);
			
		var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
			.reduce(reduceSumFunc);
			
		var slope = ssXY / ssXX;
		var intercept = yBar - (xBar * slope);
		var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
		
		return [slope, intercept, rSquare];
	}

	return correlation;
}
/* eslint-enable */