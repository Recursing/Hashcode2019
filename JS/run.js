const DEBUG = true
var util = require('util');
var fs  = require("fs");

var loadData = require("./load_data");

// Check parameters
if (process.argv.length != 3) {
	console.log("Parameters: <FILE_INPUT> ");
	process.exit(1);
}

// Load game structure in memory
var gameStructure = loadData.loadData (process.argv[2]);

// Load game structure in memory 
gameStructure.foto.sort((a, b) => {
    if (a.n_tag > b.n_tag) {
        return -1;          
    } else if (a.n_tag == b.n_tag) {
        return 0;
    } else {
        return 0;
    }
})

var solution=[];

// Grab first picture
var ref = 0;
gameStructure.foto[ref].selected = true;
solution.push (gameStructure.foto[ref]);

// Loop until all pictures are taken
while (true) {

    // Find next picture
    var max = -1;
    var next = -1;
    for (var i=0; i < gameStructure.foto.length; ++i) {
        if (gameStructure.foto[i].selected === undefined) {
            var currentScore = score (gameStructure.foto[ref], gameStructure.foto[i]);
            if (currentScore > max) {
                max = currentScore;
                next = i;
            }
        }
    }
    
    if (next == -1) break;

    gameStructure.foto[next].selected = true;
    solution.push(gameStructure.foto[next]);
}

console.log(solution.length);
solution.forEach((v) => {
    console.log(v.id);
})

function score (a, b) {
    var common = 0, onlyA = 0, onlyB = 0;
    for (var key in a.tags) {
        if (b.tags[key] !== undefined) {
            ++common;
        } else {
            ++onlyA;
        }
    }
    for (var key in b.tags) {
        if (a.tags[key] === undefined) {
            ++onlyB;
        }
    }

    var points = (common < onlyA ? (common < onlyB ? common : onlyB) : (onlyA < onlyB ? onlyA : onlyB));
    return points;
}

