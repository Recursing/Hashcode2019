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
gameStructure.foto.sort((a, b) => {
    if (a.n_tag > b.n_tag) {
        return -1;          
    } else if (a.n_tag == b.n_tag) {
        return 0;
    } else {
        return 0;
    }
})


//if (DEBUG) {
//    console.log(util.inspect(gameStructure, false, 4));
//}
