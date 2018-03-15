/*global d3:false,tooltip:false,topojson:false */
/*jshint unused:false*/
/* eslint-disable */
function d3_map(_geo_data){
	var selection,
		geo_data = _geo_data,
		width=500,
		height=500,
		speedKey = 'b-100-alle',
		speedTitle = '100',
		speedOpts = {speed:100,type:'b',technology:'alle'},
		speed,
		projection = d3.geo.mercator()
			.scale(50000)
			.precision(0.1)
			.center([13.403,52.51])
			.translate([width / 2, height / 2]),
		path = d3.geo.path()
    		.projection(projection),
    	colors = [{r:189,g:0,b:38,a:0.8},{r:240,g:59,b:32,a:0.8},{r:253,g:141,b:60,a:0.8},{r:254,g:204,b:92,a:0.8},{r:255,g:255,b:178,a:0.8}],
    	percentage_domain = [100, 95, 75, 50, 10],
    	color_scale = d3.scale.linear()
    		.domain(percentage_domain)
    		.range(colors);

	function map(sel){
		selection = sel;
		map.init();

		var legend = d3.select('#map-legend');

		var legend_x = d3.scale.linear().domain(percentage_domain).range([199,150,100,50,0]),
			x_axis = d3.svg.axis()
				.scale(legend_x)
				.orient("top")
				.tickValues(percentage_domain)
				.tickFormat(function(d, i){ return d+"%"; });

		legend.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(20,33)")
			.call(x_axis);

		var defs = legend.append("defs")
			.append("linearGradient")
				.attr("id", "gradient")
				.attr("x1", "100%")
				.attr("y1", "0%")
				.attr("x2", "0%")
				.attr("y2", "0%")
				.attr("spreadMethod", "pad");

		defs.selectAll('stop').data(colors).enter().append('stop')
			.attr("offset", function(d,i){ return (100/colors.length*i)+"%"; })
			.attr("stop-color", function(d){ return 'rgb('+d.r+','+d.g+','+d.b+')'; })
			.attr("stop-opacity", 1);

		legend.append("rect")
			.attr('x', 20)
			.attr('y', 30)
			.attr("width", 200)
			.attr("height", 20)
			.style('stroke', '#000')
			.style('stroke-width', 0.5)
			.style("fill", "url(#gradient)");

	}

	map.init = function(){
		var svg = selection.append('svg')
			.attr('viewBox', '0 0 '+width+' '+height)
			.attr('preserveAspectRatio', 'xMidYMid meet');

		svg.selectAll('path').data(geo_data).enter().append("path")
			.attr("d", function(d){
				return path(d);
			})
			.on('mouseover', function(){ 
				var o = d3.select(this);
				var d = o.data()[0];
				var bb = o.node().getBoundingClientRect();
				tooltip.content('<strong>'+d.properties.bez+', '+d.properties.bzr+', '+d.properties.plr+'</strong><br />Netz mit einer Geschwindigkeit von<br /> bis zu '+speedTitle+' Mbit/s ist zu '+d.properties[speedKey]+'% verfügbar.');
				tooltip.position([bb.left+window.pageXOffset+bb.width/2, bb.top+window.pageYOffset+bb.height/2]);
				tooltip.show(); 
			})
			.on('mouseout', function(){
				tooltip.hide();
			});

		//svg.append('text').text(year).attr('x',width/2).attr('y',height/2+130).attr('text-anchor', 'middle');

		map.updateColor();
		map.resize();

		d3.select('#map-type').on('change', function(){
			var v = d3.select(this).property('value');
			speedOpts.type = v;
			if(v == 'b'){
				speedOpts.speed = 100;
				speedOpts.technology = 'alle';
				d3.selectAll('#karte .p-disable').attr('disabled',null);
				d3.selectAll('#karte .b-disable').attr('disabled','disabled');
				d3.select('#map-technology').property('value','alle');
				d3.select('#map-speed').property('value','100');
			}else{
				speedOpts.speed = 100;
				speedOpts.technology = 'alle';
				d3.select('#map-technology').property('value','alle');
				d3.select('#map-speed').property('value','100');
				d3.selectAll('#karte .p-disable').attr('disabled','disabled');
				d3.selectAll('#karte .b-disable').attr('disabled',null);
			}
			map.updateSpeed();
		});
		d3.select('#map-technology').on('change', function(){
			var v = d3.select(this).property('value');
			speedOpts.technology = v;
			map.updateSpeed();
		});
		d3.select('#map-speed').on('change', function(){
			var v = d3.select(this).property('value');
			speedOpts.speed = v;
			map.updateSpeed();
		});
	};

	map.updateSpeed = function(){
		if(speedOpts.type == 'b'){
			speedKey = speedOpts.type + '-' + speedOpts.speed + '-' + speedOpts.technology;
		}else{
			speedKey = speedOpts.type + '-' + ((speedOpts.technology=='alle')?'all':speedOpts.technology) + '-' + speedOpts.speed + '_mbit';
		}
		speedTitle = speedOpts.speed;
		map.updateColor();
	};

	map.updateColor = function(){
		selection.selectAll('path').data(geo_data)
			.style("fill", function(d){
				var color = color_scale(d.properties[speedKey]);
				return 'rgb('+Math.round(color.r)+','+Math.round(color.g)+','+Math.round(color.b)+')';
			});
	};

	map.switchSpeed = function(s){
		speed = s;
		map.updateColor();
	};

	map.resize = function(){
		var sel = d3.select('#map');
		var bb = sel.node().getBoundingClientRect();
		width = bb.width;
		height = width;
		if(width > 500) height = 500
		selection.style('height', height+'px');
	};

	return map;
}
/* eslint-enable */