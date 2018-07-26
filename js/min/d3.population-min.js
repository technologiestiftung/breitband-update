function d3_population(t){function e(t){n=t,l.forEach(function(t){t.properties.bez in p||(p[t.properties.bez]={16:0,50:0,100:0,s16:0,s50:0,s100:0,c:0}),p[t.properties.bez][16]+=t.properties.population*((100-t.properties["p-all-16_mbit"])/100),p[t.properties.bez][50]+=t.properties.population*((100-t.properties["p-all-50_mbit"])/100),p[t.properties.bez][100]+=t.properties.population*((100-t.properties["p-all-100_mbit"])/100),p[t.properties.bez].s16+=t.properties["p-all-16_mbit"],p[t.properties.bez].s50+=t.properties["p-all-50_mbit"],p[t.properties.bez].s100+=t.properties["p-all-100_mbit"],p[t.properties.bez].c++});for(var r in p){for(var a in p[r])p[r][a]=Math.round(p[r][a]);s.push({name:r,speed:p[r],sort:{}}),d[r]=s.length-1}var u=JSON.parse(JSON.stringify(s));["16","50","100"].forEach(function(t){u.sort(function(e,r){return r.speed[t]-e.speed[t]}),u.forEach(function(e,r){s[d[e.name]].sort[t]=r})}),c=n.append("svg").attr("width","100%").attr("height",2*o+(10+i)*s.length).append("g").attr("transform","translate(0,20)"),h.domain([0,d3.max(s,function(t){return d3.max([t.speed[16],t.speed[50],t.speed[100]])})]),e.init()}function r(t){return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")}var n,a="16",i=20,o=20,p={},s=[],d={},l=t,u,c,f,b,h=d3.scale.linear(),g=[{r:189,g:0,b:38,a:.8},{r:240,g:59,b:32,a:.8},{r:253,g:141,b:60,a:.8},{r:254,g:204,b:92,a:.8},{r:255,g:255,b:178,a:.8}],m=[100,95,75,50,10],z=d3.scale.linear().domain(m).range(g);return e.init=function(){f=c.selectAll("g").data(s).enter().append("g"),f.append("text").text(function(t){return t.name}).style("text-anchor","end").style("font-size",12).attr("dy",14).attr("transform","translate(170,0)"),u=f.append("text").text(function(t){return r(t.speed[a])}).style("font-size",12).attr("dy",14),b=f.append("rect").attr("transform","translate(180,0)").attr("height",i),d3.selectAll(".population-button").on("click",function(){d3.selectAll(".population-button").classed("active",!1),d3.select(this).classed("active",!0),e.switch(d3.select(this).attr("data-key"))}),e.resize()},e.resize=function(){var t=n.node().getBoundingClientRect();width=t.width,h.range([0,width-3*o-210-30]),e.update()},e.update=function(){f.data(s).transition().duration(300).attr("transform",function(t){return"translate(0, "+t.sort[a]*(i+10)+")"}),b.transition().duration(300).attr("width",function(t){return h(t.speed[a])}).style("fill",function(t){var e=z(t.speed["s"+a]/t.speed.c);return"rgb("+Math.round(e.r)+","+Math.round(e.g)+","+Math.round(e.b)+")"}),u.text(function(t){return r(t.speed[a])+" | "+(100-t.speed["s"+a]/t.speed.c).toFixed(1)+"%"}).transition().duration(300).attr("transform",function(t){return"translate("+(h(t.speed[a])+20+170)+",0)"})},e.switch=function(t){a=t,e.update()},e}