var exports = module.exports = {};


var util = require('util');
var fs  = require("fs");


// Loading data
function loadData (filename) {
	var lineCounter = 0;
	var gameStructure = {};
	var inputStructure = [];
	fs.readFileSync(filename).toString().split('\n').forEach(function (line) { 
		inputStructure.push(line);
	});

	var workingLine= "";
	workingLine = inputStructure[lineCounter ++].split(' ');

	// Load header
	gameStructure.n_foto = 1.*workingLine[0];

	// Load video dimensions
	gameStructure.foto = [];
	for (var i = 0; i < gameStructure.n_foto; ++i) {
		workingLine = inputStructure[lineCounter ++].split(' ');

        gameStructure.foto[i] = {};
        gameStructure.foto[i].id = i;        
		gameStructure.foto[i].orientation = workingLine[0];
        gameStructure.foto[i].n_tag = 1.*workingLine[1];
        //gameStructure.foto[i].tags = {};
        gameStructure.foto[i].tags = [];
        for (var j=0; j < gameStructure.foto[i].n_tag; ++j) {
            //gameStructure.foto[i].tags[workingLine[2 + j]] = 1;
            gameStructure.foto[i].tags.push(workingLine[2 + j]);
        }
	}

	return gameStructure;


}

module.exports = { loadData: loadData};
