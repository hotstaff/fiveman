//entry.js entorypoint of index.js
require("./js/bootstrap.js");
//define is false for amd is disabled 
require('imports-loader?define=>false!./js/index.js');
//require("./js/index.js");