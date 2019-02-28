const DEBUG = true
var util = require('util');
var fs  = require("fs");

var loadData = require("./load_data");


Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

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
var v1 = [];
gameStructure.foto[ref].selected = true;
if (gameStructure.foto[ref].orientation == 'V') {
    var max = -1;
    var nextV = -1;    
    for (var i=0; i < gameStructure.foto.length; ++i) {
        if (gameStructure.foto[i].selected === undefined && 
            gameStructure.foto[i].orientation === 'V') {
            var currentScore = score2 (gameStructure.foto[ref], gameStructure.foto[i]);
            if (currentScore > max) {
                max = currentScore;
                nextV = i;
            }
        }
    }
    gameStructure.foto[nextV].selected = true;
    var v = [];
    v.push(gameStructure.foto[ref]);
    v.push(gameStructure.foto[nextV]);
    gameStructure.foto[ref].tags = 
        gameStructure.foto[ref].tags.concat(
            gameStructure.foto[nextV].tags).unique();
    solution.push(v);
} else {
    v1.push (gameStructure.foto[ref])
    solution.push (v1);
}

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

    // Check if pictures is landscape
    gameStructure.foto[next].selected = true;
    if (gameStructure.foto[next].orientation == 'V') {
        var max = -1;
        var nextV = -1;    
        for (var i=0; i < gameStructure.foto.length; ++i) {
            if (gameStructure.foto[i].selected === undefined && 
                gameStructure.foto[i].orientation === 'V') {
                var currentScore = score2 (gameStructure.foto[next], gameStructure.foto[i]);
                if (currentScore > max) {
                    max = currentScore;
                    nextV = i;
                }
            }
        }
        gameStructure.foto[nextV].selected = true;
        var v = [];
        v.push(gameStructure.foto[next]);
        v.push(gameStructure.foto[nextV]);

        gameStructure.foto[next].tags = 
            gameStructure.foto[next].tags.concat(
                gameStructure.foto[nextV].tags).unique();
        solution.push(v);
    } else {
        var v = [];
        v.push(gameStructure.foto[next]);
        solution.push(v);
    }
}

//console.log(util.inspect(solution,false, 4));

console.log(solution.length);
for (v in solution) {
    separator = '';
    for (e in solution[v]) {
        process.stdout.write(separator + solution[v][e].id);
        separator = ' ';
    }

    process.stdout.write("\n");
}

function score (a, b) {
    var common = 0, onlyA = 0, onlyB = 0;

    a.tags.forEach((key) => {
        if (b.tags.includes(key)) {
            ++common;
        } else {
            ++onlyA;
        }

    })
    b.tags.forEach((key) => {
        if (! a.tags.includes(key)) {
            ++onlyB;
        }
    });

    var points = (common < onlyA ? (common < onlyB ? common : onlyB) : (onlyA < onlyB ? onlyA : onlyB));
    return points;
}

function score2 (a, b) {
    var common = 0, onlyA = 0, onlyB = 0;
    a.tags.forEach((key) => {
        if (b.tags.includes(key)) {
            ++common;
        } else {
            ++onlyA;
        }

    })
    b.tags.forEach((key) => {
        if (! a.tags.includes(key)) {
            ++onlyB;
        }
    });

    var points = (onlyA + onlyB - common);
    return points;
}

