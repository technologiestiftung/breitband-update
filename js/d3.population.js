/*global d3:false */
/*jshint unused:false*/
/* eslint-disable */
function d3_population(_geo_data){
	var selection,
		speedKey = '16',
		barHeight = 20,
		padding = 20,
		districts = {},
		district_data = [],
		district_keys = {},
		data = _geo_data,
		labels,
		svg, gs, bars, x = d3.scale.linear(),
		colors = [{r:189,g:0,b:38,a:0.8},{r:240,g:59,b:32,a:0.8},{r:253,g:141,b:60,a:0.8},{r:254,g:204,b:92,a:0.8},{r:255,g:255,b:178,a:0.8}],
    	percentage_domain = [100, 95, 75, 50, 10],
    	color_scale = d3.scale.linear()
    		.domain(percentage_domain)
    		.range(colors);

	function population(sel){
		selection = sel;

		data.forEach(function(d){
			if(!(d.properties.bez in districts)){
				districts[d.properties.bez] = {16:0,50:0,100:0,s16:0,s50:0,s100:0,c:0}
			}
			districts[d.properties.bez][16] += d.properties.population * ((100-d.properties['p-all-16_mbit'])/100);
			districts[d.properties.bez][50] += d.properties.population * ((100-d.properties['p-all-50_mbit'])/100);
			districts[d.properties.bez][100] += d.properties.population * ((100-d.properties['p-all-100_mbit'])/100);
			districts[d.properties.bez].s16 += d.properties['p-all-16_mbit'];
			districts[d.properties.bez].s50 += d.properties['p-all-50_mbit'];
			districts[d.properties.bez].s100 += d.properties['p-all-100_mbit'];
			districts[d.properties.bez].c++;
		});

		for(var name in districts){
			for(var s in districts[name]){
				districts[name][s] = Math.round(districts[name][s]);
			}
			district_data.push({
				name:name,
				speed:districts[name],
				sort:{}
			});
			district_keys[name] = district_data.length-1;
		}

		var sort = JSON.parse(JSON.stringify(district_data));
		(['16','50','100']).forEach(function(s){
			sort.sort(function(a,b){
				return b.speed[s]-a.speed[s];
			});
			sort.forEach(function(ss,si){
				district_data[district_keys[ss.name]].sort[s] = si;
			});
		});

		svg = selection.append('svg').attr('width','100%').attr('height',(padding*2+(10+barHeight)*district_data.length)).append('g').attr('transform','translate(0,20)');
		
		x.domain([0,d3.max(district_data, function(d){ return d3.max([d.speed[16],d.speed[50],d.speed[100]]); })]);

		population.init();
	}

	population.init = function(){
		gs = svg.selectAll('g').data(district_data).enter().append('g');
		gs.append('text').text(function(d){
				return d.name;
			})
			.style('text-anchor', 'end')
			.style('font-size', 12)
			.attr('dy', 14)
			.attr('transform','translate(170,0)');

		labels = gs.append('text').text(function(d){
				return formatNum(d.speed[speedKey]);
			})
			.style('font-size', 12)
			.attr('dy', 14);

		bars = gs.append('rect').attr('transform','translate('+(170+10)+',0)').attr('height',barHeight);

		d3.selectAll('.population-button').on('click', function(){
			d3.selectAll('.population-button').classed('active',false);
			d3.select(this).classed('active',true);
			population.switch(d3.select(this).attr('data-key'));
		});

		population.resize();
	};

	function formatNum (x) {
	  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}

	population.resize = function(){
		var bb = selection.node().getBoundingClientRect();
		width = bb.width;
		x.range([0, (width-3*padding-210-30)]);
		population.update();
	};

	population.update = function(){
		gs.data(district_data).transition().duration(300).attr('transform', function(d){ return 'translate(0, '+ d.sort[speedKey]*(barHeight+10) +')'; });

		bars.transition().duration(300)
		.attr('width', function(d){
			return x(d.speed[speedKey]);
		}).style('fill', function(d){
			var color = color_scale(d.speed['s'+speedKey]/d.speed.c);
			return 'rgb('+Math.round(color.r)+','+Math.round(color.g)+','+Math.round(color.b)+')';
		});

		labels.text(function(d){
			return formatNum(d.speed[speedKey]) + ' | ' + (100 - (d.speed['s'+speedKey]/d.speed.c)).toFixed(1) + '%';
		}).transition().duration(300).attr('transform', function(d){ return 'translate('+(x(d.speed[speedKey])+20+170)+',0)'; });
	};

	population.switch = function(key){
		speedKey = key;
		population.update();
	};

	return population;
}
/* eslint-enable */