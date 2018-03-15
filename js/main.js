/*jshint unused:false*/
var colorPalletes = {// eslint-disable-line no-unused-vars
	red:[
		[230,0,50]
	],
	blue:[
		[30,55,145],
		[55,90,165],
		[45,145,210],
		[100,185,230],
		[110,205,245]
	],
	green:[
		[0,115,125],
		[20,150,140],
		[55,180,150],
		[145,200,130],
	],
	yellow:[
		[220,200,45],
		[220,225,75]
	]
};

function debouncer( func , timeout ) {// eslint-disable-line no-unused-vars
	var timeoutID , timeout = timeout || 200;
	return function () {
		var scope = this , args = arguments;
		clearTimeout( timeoutID );
		timeoutID = setTimeout( function () {
			func.apply( scope , Array.prototype.slice.call( args ) );
		} , timeout );
	};
}