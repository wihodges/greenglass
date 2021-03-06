/*global process:false require:false exports:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

var server = require('bb-server')
    // ,testSendMail = require("./testSendMail.js")
    ,save = require("./save")
    ,sync = require("./sync.js")
    ,dropbox_authorize = require("./dropbox_authorize.js")
    ,dropbox_connect = require("./dropbox_connect.js")
    // save = require("./save")
;
 
var options = { 
    root: 'www'
    // "forward": [
    //     { "prefix": "local",
    //       "target": "http://localhost:5984" },
    //     { "prefix": "iris",
    //       "target": "https://michieljoris.iriscouch.com"}
// ]
    ,"dir": true
    ,"index": false
    ,"silent": false
    ,"port": 6005
    ,postHandlers: {
        "/greenglass" : save
        // "/contactus_form" : testSendMail
        }
    ,getHandlers: {
        "/sync": sync,
        "/dropbox_authorize": dropbox_authorize,
        "/dropbox_connect": dropbox_connect
    }
};

server.go(options);
