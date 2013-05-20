/*global process:false require:false exports:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

var htmlBuilder = require('html-builder');
var fs = require('fs');
var dbox  = require("dbox");
var dropboxApp = require("./dropboxApp");
var utils = require('util');
var gm = require('gm');
var processImages = require('./processImages');

var client;
var compress;

// var fileMap  = fs.readFileSync("./server/DropboxToServerMap.json", 'utf8');
// fileMap = JSON.parse(fileMap);
    
var allMetaData = {};
var busy = false;

var log = [];
function debug() {
    console.log.apply(console, arguments);
    log.push(arguments);
}

function getMetaData( path, callback) {
    var options = {
        file_limit         : 10000,              // optional
        hash               : allMetaData[path] ? allMetaData[path].hash : '',
        list               : true,               // optional
        include_deleted    : false              // optional
        // ,rev                : 7,                  // optional
        // locale:            : "en",               // optional
        // root:              : "sandbox"           // optional
    };
    // debug('options:' , options);

    client.metadata(path, options, function(status, reply){
        if (status === 304) {
            // debug(path + ' is already in allMetaData');
            callback(allMetaData[path]);
            return;   
        }
        if (status !== 200)  {
            debug("error in retrieving metadata for " + path);
            callback();
            return;
        }
        if (!reply.is_dir) { //shouldn't happen since we're only calling getMetadData on directories
            // debug("Retrieved metadata for file " + path);
            callback();
            return;
        }
        // debug('adding ' + reply.path + '  to allMetaData');
        allMetaData[path] = reply;
        callback(reply);
    });
}

function buildMetaData(path, done) {
    debug("Inspecting " + path);
    getMetaData(path, function(metaData) {
        // debug('metadata received', metaData);
        if (metaData && metaData.contents) {
            // debug('this path has contents..');
            var dirCount = 0;
            metaData.contents.forEach(function(c) {
                if (c.is_dir) dirCount++;
            });
            // debug('And it has ' + dirCount + ' directories');
            if (dirCount === 0) done();
            else {
                metaData.contents.forEach(function(c) {
                    if (c.is_dir) {
                        buildMetaData(c.path, function() {
                            dirCount--;
                            if (dirCount === 0) done(); 
                        });
                    }
                });
            }
            
            
        } 
        else done();
    });
}


function getModTime(path) {
    // debug("in getmodtime");
    try {
        var stats = fs.statSync(process.cwd() + path);
        return stats.mtime.getTime();
    } catch(e) {
        debug(e);
        return 0;
    }
}

function getPathAndName(filename) {
    var slash = filename.lastIndexOf('/');
    var path = filename.slice(0, slash);
    if (path === '') path = '/';
    var name = filename.slice(slash);
    return { path: path, name: name };
}

function makeFileMap() {
    var files = allMetaData['/'].contents;
    var fileMap = {};
    files.forEach(function(f) {
        fileMap[f.path] = '/dropbox' + f.path;
    });
    return fileMap;
}


function processMap() {
    var dropboxToServer = [];
    var serverToDropbox = [];
    var fileMap = makeFileMap();
    debug('filemap:\n', fileMap);
    // console.log(allMetaData['/'].contents);
    Object.keys(fileMap).forEach(function(k) {
        var pair = { dropbox: k,
                     server: fileMap[k] };
        // debug(pair.dropbox);
        var dropboxFile = getPathAndName(pair.dropbox);
        // debug(file.path, allMetaData[file.path]);
        var pathMetaData = allMetaData[dropboxFile.path];
        if (!pathMetaData) {
            debug("Error: Couldn't find metaData in dropbox for " + pair.dropbox);
            return;
        }
        if (!pathMetaData.contents) {
            debug("Error: Folder exists, but this folder is empty, certainly no " + pair.dropbox);
            return;
        }
        var contents = pathMetaData.contents;
        var i = contents.length;
        while (i-- > 0  && contents[i].path !== k ) ;
        var metaData = contents[i];
        if (!metaData) {
            debug("Error: Couldn't find metadata for " + k);
            return;
        }
        // debug('Dropbox:' ,metaData.modified, Date.parse(metaData.modified));
        // debug(typeof metaData.modified);
        
        // metaData.contents.forEach(function(c) {
        //     debug(utils.inspect(c));
            
        // });
        var serverTime = getModTime(pair.server);
        if (serverTime === 0 ) {
            debug("Warning: Couldn't get modtime for file on server!!! " + pair.server);
            }
        // debug('server:', serverTime);
        var dropboxTime = Date.parse(metaData.modified);
        if (dropboxTime < serverTime)  serverToDropbox.push(pair);
        else dropboxToServer.push(pair);
    }); 
    if (serverToDropbox.length > 0) {
        debug("Warning. The following files have been modified on the server: \n" , serverToDropbox);
    }
    return dropboxToServer;
}

function copyFilesFromDropbox(files, done) {
    var counter = files.length;
    if (counter === 0) {
        done();
        return;
    }
    files.forEach(function(f) {
        client.get(f.dropbox, function(status, reply, metadata){
            if (status !== 200) {
                debug("Error: couldn't pull file from dropbox: " + f.dropbox);
                counter--;
                if (counter === 0) done();
                return;
            }
            // debug(reply, metadata);
            if (!reply) {
                debug(f.dropbox + 'has no contents it seems. Not saving');
                counter--;
                if (counter === 0) done();
                return;
            }
            fs.writeFile(process.cwd() + f.server, reply, function(err) {
                if(err) {
                    debug("Couldn't save file to server " + f.server + ' ' ,err);
                    counter--;
                    if (counter === 0) done();
                    // res.end("Couldn't store request_token...");
                } else {
                    debug("Saved dropbox file " + f.dropbox + ' to ' + f.server);
                    counter--;
                    if (counter === 0) done();
                }
            });                    
        
        }); 
        
    });
}

function setDropboxClient() {
    var app_key= dropboxApp.data.app_key;
    var app_secret = dropboxApp.data.app_secret;
    var app = dbox.app({ "app_key": app_key, "app_secret": app_secret });
    var access_token;
    try {
        access_token  = fs.readFileSync("./access_token.json", 'utf8');
        access_token = JSON.parse(access_token);
        client = app.client(access_token);
    } catch(e) {
        debug("Couldn't find the access token..");
    } 
}

function writePrettyDebug(res) {
    res.write('<p>');
    log.forEach(function(l) {
        Object.keys(l).forEach(function(k) {
            if (typeof l[k] === 'string') res.write(l[k]);
            else res.write(utils.inspect(l[k]));
            res.write("</br>");
        });
    });   
    res.end('Done');
}

function makeServerImages(files, done) {
    if (!files) return;
    debug("Creating thumbnails:");
    processImages.process('dropbox/', files, 'thumbnails/', '400', 50, function(aLog) {
        log = log.concat(aLog);
        debug("Creating fullsized images:");
        processImages.process('dropbox/',files, 'fullsize/', '1600', 50, function(aLog) {
            log = log.concat(aLog);
            done();
        });
    });
}

function sync(done) {
    buildMetaData('/', function() {
        debug("Finished inspecting dropbox");
        var dropboxToServer = processMap();
        debug('To be copied from dropbox to server: \n', dropboxToServer);
        copyFilesFromDropbox(dropboxToServer, function() {
            if (compress) 
                makeServerImages(fs.readdirSync(process.cwd() + '/dropbox'), done);
            else if (dropboxToServer.length > 0) {
                var files = [];
                dropboxToServer.forEach(function(pair) {
                    files.push(pair.dropbox);
                });
                makeServerImages(files, done);
            }
            else {  debug("No changes to dropbox files, so not compressing images");
                    done([]);
                 }
        });
    });
}

    

var intervalID;
exports.handleGet = function(req, res) {
    log = [];
    res.writeHead(200, {
        'Content-Type': 'text/html'
	// 'last-modified': GMTdate
    });
    debug('Sync report:');
    // debug("Query: " , req.url.query);
    if (busy) {
        res.end("Busy syncing right now. Try again in a minute");
        return;
    }
    // res.write("The server has been asked to sync with dropbox.<p>");
    busy = true;
    
    // res.write("In sync");
    
    setDropboxClient();
    if (!client) { res.end( "Can't find access token. Maybe try to authorize " +
                            '<a target="_blank" href="' + "/dropbox_authorize" + '">dropbox</a>' +
                            " first");
                   return;
                 } 
    
    var interval = req.url.query.interval;
    compress = req.url.query.compress;
    if (interval) {
        interval = parseInt(interval,10);
        if (interval) {
            clearInterval(intervalID);
            
            intervalID = setInterval(function() { sync(function() {}); }, interval*60000);
            debug("Setting frequency of sync to " + interval + " minutes " + intervalID);
        }
        else {
            debug("Cancelling regular sync " + intervalID);
            clearInterval(intervalID);
        }           
    } 
    
    sync(function() {
        busy = false;
        // debug('Done');
        writePrettyDebug(res);
    });
};