var gm = require('gm');
console.log('started');

var log;
function debug() {
    console.log.apply(console, arguments);
    log.push(arguments);
}

function compress(file, quality, callback) {
    gm()
        .compress()['in'](file)
        .out('JPEG', '-quality', quality.toString())
        .write(file, function (err) {
            if (err) debug(err);
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

function processImages(pathIn, files, pathOut, resize, quality, done) {
    log = [];
    // debug('Processing images..');
    var count = files.length;
    if (!count) {
        done(log);   
    }
    else files.forEach(function(f) {
        gm(pathIn + f)
            .autoOrient()
            .resize(resize)
            .write(pathOut + f, function (err) {
                if (err) {
                    debug(err);
                    count--;
                    if (!count) done(log);
                }
                else {
                    compress(pathOut + f, quality,  function() {
                        debug(pathOut + f);
                        count--;
                        if (!count) done(log);
                    });
                    
                }
            });
    });
}


exports.process = processImages;
