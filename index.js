const 	fs = require('fs'),
		d3 = require('d3'),
		topojson = require('topojson'),
		turf = require('@turf/turf')

let o = d3.csvParse(fs.readFileSync('data/all_o.csv', 'utf8')),
	n = JSON.parse(fs.readFileSync('data/all-privat-leitung.json')),
	k = {}, bzr = {}

n.index.forEach(d=>{
	if(!(d.bezname in k)) {
		k[d.bezname] = {bezirk:d.bezname, 16:[],50:[],100:[]}
	}
	k[d.bezname]['16'].push(parseInt(d['16_mbit'].replace(',','.')))
	k[d.bezname]['50'].push(parseInt(d['50_mbit'].replace(',','.')))
	k[d.bezname]['100'].push(parseInt(d['100_mbit'].replace(',','.')))
})

o.forEach(oo=>{
	if(!(oo.bezirk in bzr)) {
		bzr[oo.bezirk] = []
	}
	if(bzr[oo.bezirk].indexOf(oo.ortsteil) == -1){
		bzr[oo.bezirk].push(oo.ortsteil)
	}

})

let districts = {
	"Charlottenburg-Wilmersdorf":{
		"2011":{leitung16:683,leitung50:614,count:7},
		"2012":{leitung16:689,leitung50:630,count:7},
		"2013":{leitung16:693,leitung50:668,count:7},
		"2015":{leitung16:695,leitung50:670,count:7}
	},"Friedrichshain-Kreuzberg":{
		"2011":{leitung16:184,leitung50:149,count:2},
		"2012":{leitung16:194,leitung50:162,count:2},
		"2013":{leitung16:195,leitung50:163,count:2},
		"2015":{leitung16:198,leitung50:177,count:2}
	},"Lichtenberg":{
		"2011":{leitung16:853,leitung50:665,count:10},
		"2012":{leitung16:901,leitung50:747,count:10},
		"2013":{leitung16:892,leitung50:690,count:10},
		"2015":{leitung16:934,leitung50:764,count:10}
	},"Marzahn-Hellersdorf":{
		"2011":{leitung16:469,leitung50:336,count:5},
		"2012":{leitung16:477,leitung50:361,count:5},
		"2013":{leitung16:487,leitung50:397,count:5},
		"2015":{leitung16:492,leitung50:418,count:5}
	},"Mitte":{
		"2011":{leitung16:579,leitung50:524,count:6},
		"2012":{leitung16:588,leitung50:537,count:6},
		"2013":{leitung16:594,leitung50:560,count:6},
		"2015":{leitung16:600,leitung50:565,count:6}
	},"Neukölln":{
		"2011":{leitung16:474,leitung50:394,count:5},
		"2012":{leitung16:483,leitung50:404,count:5},
		"2013":{leitung16:489,leitung50:432,count:5},
		"2015":{leitung16:496,leitung50:433,count:5}
	},"Pankow":{
		"2011":{leitung16:1060,leitung50:682,count:13},
		"2012":{leitung16:1076,leitung50:731,count:13},
		"2013":{leitung16:1123,leitung50:831,count:13},
		"2015":{leitung16:1197,leitung50:929,count:13}
	},"Reinickendorf":{
		"2011":{leitung16:963,leitung50:761,count:10},
		"2012":{leitung16:973,leitung50:764,count:10},
		"2013":{leitung16:987,leitung50:853,count:10},
		"2015":{leitung16:997,leitung50:897,count:10}
	},"Spandau":{
		"2011":{leitung16:809,leitung50:668,count:9},
		"2012":{leitung16:818,leitung50:702,count:9},
		"2013":{leitung16:846,leitung50:780,count:9},
		"2015":{leitung16:862,leitung50:792,count:9}
	},"Steglitz-Zehlendorf":{
		"2011":{leitung16:670,leitung50:540,count:7},
		"2012":{leitung16:674,leitung50:548,count:7},
		"2013":{leitung16:687,leitung50:624,count:7},
		"2015":{leitung16:694,leitung50:627,count:7}
	},"Tempelhof-Schöneberg":{
		"2011":{leitung16:584,leitung50:511,count:6},
		"2012":{leitung16:589,leitung50:520,count:6},
		"2013":{leitung16:590,leitung50:554,count:6},
		"2015":{leitung16:598,leitung50:557,count:6}
	},"Treptow-Köpenick":{
		"2011":{leitung16:1394,leitung50:912,count:15},
		"2012":{leitung16:1395,leitung50:964,count:15},
		"2013":{leitung16:1446,leitung50:1220,count:15},
		"2015":{leitung16:1463,leitung50:1236,count:15}
	}
};

let csv = ''

const years = [2011,2012,2013,2015,2017]

let light = {}


for(let b in k){
	districts[b]['2017']={
		leitung16:k[b]['16'].reduce((a,b)=>{return a+b;}),
		leitung50:k[b]['50'].reduce((a,b)=>{return a+b;}),
		count:k[b]['16'].length
	};

	bzr[b].forEach(bz=>{
		csv += '2017,"'+b+'","'+bz+'",'+(k[b]['16'].reduce((a,b)=>{return a+b;})/k[b]['16'].length).toFixed(2)+','+(k[b]['50'].reduce((a,b)=>{return a+b;})/k[b]['16'].length).toFixed(2)+"\n"
	})

	light[b] = []
	years.forEach(y=>{
		light[b].push({
			year:y,
			leitung16:parseFloat((districts[b][y].leitung16/districts[b][y].count).toFixed(2)),
			leitung50:parseFloat((districts[b][y].leitung50/districts[b][y].count).toFixed(2))
		})
	})
}

fs.writeFileSync('data/mapdata.json', JSON.stringify(districts), 'utf8')
fs.writeFileSync('data/mapdata-light.json', JSON.stringify(light), 'utf8')

fs.writeFileSync('data/csvdata.json', csv, 'utf8')

const datamap = [
	{file:'all-100mbit.json', 			column:'b-100', 	keys:['alle']},
	{file:'all-50mbit.json', 			column:'b-50', 	keys:['alle']},
	{file:'all-30mbit.json', 			column:'b-30', 	keys:['alle']},
	{file:'all-10mbit.json', 			column:'b-10', 	keys:['alle']},
	{file:'all-2mbit.json', 			column:'b-2', 	keys:['alle']},
	{file:'all-privat-alle.json', 		column:'p-all', 	keys:['100_mbit','16_mbit','1_mbit','2_mbit','30_mbit','50_mbit','6_mbit']},
	{file:'all-privat-drahtlos.json', 	column:'p-wireless', 	keys:['100_mbit','16_mbit','1_mbit','2_mbit','30_mbit','50_mbit','6_mbit']},
	{file:'all-privat-leitung.json', 	column:'p-wired', 	keys:['100_mbit','16_mbit','1_mbit','2_mbit','30_mbit','50_mbit','6_mbit']}
]

let geojson = JSON.parse(fs.readFileSync('data/lor_planungsraeume.geojson', 'utf8')),
	geojson_keys = {}

geojson.features.forEach((g,i)=>{
	let id = parseInt(geojson.features[i].properties.spatial_name)
	geojson.features[i].properties.spatial_name = id;
	geojson.features[i].properties['bez'] = geojson.features[i].properties.BEZNAME
	geojson.features[i].properties['bzr'] = geojson.features[i].properties.BZRNAME
	geojson.features[i].properties['plr'] = geojson.features[i].properties.PLRNAME
	geojson_keys[id] = i

	delete geojson.features[i].properties.gml_id
	delete geojson.features[i].properties.BEZNAME
	delete geojson.features[i].properties.BZRNAME
    delete geojson.features[i].properties.DATUM
    delete geojson.features[i].properties.PGRNAME
    delete geojson.features[i].properties.PLRNAME
    delete geojson.features[i].properties.SHAPE_AREA
    delete geojson.features[i].properties.spatial_alias
    delete geojson.features[i].properties.spatial_name
    delete geojson.features[i].properties.spatial_type

})

datamap.forEach(m=>{
	const jsonData = JSON.parse(fs.readFileSync('data/'+m.file, 'utf8'))
	jsonData.index.forEach(j=>{
		m.keys.forEach(k=>{
			geojson.features[geojson_keys[j.plr]].properties[m.column+'-'+k] = parseFloat(j[k].replace(',','.'))
		})
	})
})

const population = d3.csvParse(fs.readFileSync('data/EWR201612E_Matrix.csv', 'utf8'))

population.forEach(p=>{
	const id = parseInt(p.RAUMID)
	geojson.features[geojson_keys[id]].properties['population'] = parseInt(p.E_E)
})

let center = turf.centerOfMass(geojson)
	center = turf.point([13.385030,52.517590])

const west = JSON.parse(fs.readFileSync('data/berlin-wall-light.geojson', 'utf8'))

geojson.features.forEach((f,fi) => {
	const localCenter = turf.centerOfMass(f)
	geojson.features[fi].properties['dist'] = turf.distance(center, localCenter)

	const a = turf.area(f)

	const intersection = turf.intersect(f, west.features[0])

	let type = 0

	if(intersection == null){
		type = 0
	}else if(intersection.geometry.type == 'LineString' || intersection.geometry.type == 'MultiLineString'){
		type = 0
	}else{
		const ia = turf.area(intersection)
		if(ia/a < 0.1){
			type = 0
		}else if(ia/a < 0.8){
			type = 1
		}else{
			type = 2
		}
	}
	geojson.features[fi].properties['east'] = type
	geojson.features[fi] = turf.rewind(f, {reverse:true})
})

fs.writeFileSync('data/complete.geojson', JSON.stringify(geojson), 'utf8')

var topology = topojson.topology({Bezirk: geojson});
	topology = topojson.presimplify(topology)
	topology = topojson.simplify(topology,0.000001)
	topology = topojson.quantize(topology,1e4)

fs.writeFileSync('data/complete.topojson', JSON.stringify(topology), 'utf8')

let bezirke = JSON.parse(fs.readFileSync('data/bezirksgrenzen.geojson', 'utf8'))

bezirke.features.forEach((f,fi)=>{
	let n = f.properties.Gemeinde_name
	for(let key in f.properties){
		delete bezirke.features[fi].properties[key]
	}
	bezirke.features[fi].properties['name'] = n
	bezirke.features[fi] = turf.rewind(f, {reverse:true})
})

var topology = topojson.topology({berlin_bezirke: bezirke});
	topology = topojson.presimplify(topology)
	topology = topojson.simplify(topology,0.000001)
	topology = topojson.quantize(topology,1e4)

fs.writeFileSync('data/berlin_bezirke.topojson', JSON.stringify(topology), 'utf8')