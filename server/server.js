/*global process:false require:false exports:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

var server = require('bb-server'),
    // testMail = require("./testSendMail"),
    save = require("./save")
;

 
var options = { 
    // "forward": [
    //     { "prefix": "local",
    //       "target": "http://localhost:5984" },
    //     { "prefix": "iris",
    //       "target": "https://michieljoris.iriscouch.com"}
// ]
    "dir": true
    ,"index": false
    ,"silent": false
    // ,"port": 7090
    ,postHandlers: {
        "/greenglass" : save
        // "/sendmail" : testMail
        }
};

server.go(options);
