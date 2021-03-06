/*global process:false require:false exports:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 
var dev = process.env.BB_SERVER_DEV;
if (dev) console.log('\n------Server running with development settings------\n');

var server = require('bb-server')
// testMail = require("./testSendMail"),
,save = require("./save")

,sync = require("./sync.js")
,dropbox_authorize = require("./dropbox_authorize.js")
,dropbox_connect = require("./dropbox_connect.js")
,deleteImg = require("./deleteImg")
;

 
var options = { 
    // "forward": [
    //     { "prefix": "local",
    //       "target": "http://localhost:5984" },
    //     { "prefix": "iris",
    //       "target": "https://michieljoris.iriscouch.com"}
// ]
    "root": "www"
    ,"dir": dev
    ,"index": !dev
    ,"silent": false
    ,"port": 6002
    ,postHandlers: {
        "/greenglass" : save
        // "/sendmail" : testMail
        ,"/delete": deleteImg
        }
    ,getHandlers: {
        "/sync": sync,
        "/dropbox_authorize": dropbox_authorize,
        "/dropbox_connect": dropbox_connect
    }
};

server.go(options);
