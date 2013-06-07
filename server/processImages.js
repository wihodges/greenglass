 var gm = require('gm');

var log;
function debug() {
    console.log.apply(console, arguments);
    log.push(arguments);
}

function compress(file, quality, callback) {
    "use strict";
    gm()
        .compress()['in'](file)
        .out('JPEG', '-quality', quality.toString())
        .write(file, function (err) {
            callback(err);
        });
        
    // var spawn = require('child_process').spawn;
    // var args = ['-convert' , 'testin.jpg', "-quality", "50", 'spawn.jpg' ];
    // var ls = spawn('gm', args);
    // // debug(composite);
    // ls.stdout.on('data', function (data) {
    //     debug('stdout: ' + data);
    // });

    // ls.stderr.on('data', function (data) {
    //     debug('stderr: ' + data);
    // });

    // ls.on('close', function (code) {
    //     debug('child process exited with code ' + code);
    // });
}

function resizeFiles(pathIn, someFiles, pathOut, resize, done) {
    "use strict";
    debug('Resizing..');
    var resized = 0;
    var files = [];
    someFiles.forEach(function(f) {
        files.push(f);
    });
    function r(f, cb) {
        if (!f) cb();
        else gm(pathIn + f)
            .autoOrient()
            .resize(resize)
            .write(pathOut + f, function (err) {
                if (err) { debug(err); }
                else {
                    debug('Resized ' + f);
                    resized++; }
                r(files.pop(), cb);
            });
    }
    
    r(files.pop(), function() {
        debug('Resized ' + resized + ' images of ' + someFiles.length);
        done();
    });

}

function compressFiles(pathIn, someFiles, pathOut, quality, done) {
    
    "use strict";
    debug('Resizing..');
    var compressed = 0;
    var files = [];
    someFiles.forEach(function(f) {
        files.push(f);
    });
    
    function r(f, cb) {
        if (!f) cb();
        else compress(pathOut + f, quality,  function(err) {
            if (err) { debug(err); }
            else {
                debug('Compressed ' + f);
                compressed++; }
            r(files.pop(), cb);
        });
    }
    
    r(files.pop(), function() {
        debug('Compressed ' + compressed + ' images of ' + someFiles.length);
        done();
    });
}

function processImages(pathIn, files, pathOut, resize, quality, aLog, done) {
    "use strict";
    // log = [];
    log = aLog;
    debug('Processing ' + files.length + ' images.');
    resizeFiles(pathIn, files, pathOut, resize, function() {
        compressFiles(pathIn, files, pathOut, quality, function() {
            done(log);
        });
    }
    ) ;
} 

// function processImages(pathIn, files, pathOut, resize, quality, done) {
//     "use strict";
//     log = [];
//     debug('Processing ' + files.length + ' images.');
//     var count = files.length;
//     if (!count) {
//         done(log);   
//     }
//     else files.forEach(function(f) {
//         gm(pathIn + f)
//             .autoOrient()
//             .resize(resize)
//             .write(pathOut + f, function (err) {
//                 if (err) {
//                     debug(err);
//                     count--;
//                     if (!count) done(log);
//                 }
//                 else {
//                     compress(pathOut + f, quality,  function(err) {
//                         count--;
//                         if (err) {
//                             debug(err);
//                         }
//                         else debug(pathOut + f);
//                         if (!count) done(log);
//                     });
                    
//                 }
//             });
//     });
// }


exports.process = processImages;
