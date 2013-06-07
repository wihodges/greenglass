/*global process:false require:false exports:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 
var fs = require('fs');

function sendResponse(res, obj) {
    var headers = {'Content-Type': 'text/html'};
    var returnCode = 403;
    var descr = obj.reason;
    if (obj.success) {
        // var expireDate = new Date(new Date().getTime() + 24*60*60).toUTCString();
        // headers['Set-Cookie'] = 'persona=' +obj.email + '; expires=' + expireDate;
        returnCode = 200; 
        descr = "OK";
    }
    res.writeHead(returnCode, descr, headers);
    res.write(JSON.stringify(obj));
    res.end();
}

function deleteImg(res, name) {
    var count = 3, err1, err2, err3;
    function done() {
       if (count) return; 
        if (err1 || err2 || err3 )
            sendResponse(res, { success:false, error: (err1 || err2 || err3).toString() });
        else sendResponse(res, { success:true, name: name });
    }
    fs.unlink(process.cwd() + '/dropbox/' + name, function(err) {
        // err1 = err;
        if (err) console.log('Delete error in dropbox ' + err);
        count--;
        done();
    });
    
    fs.unlink(process.cwd() + '/fullsize/' + name, function(err) {
        // err2 = err;
        if (err) console.log('Delete error in fullsize ' + err);
        count--; 
        done();
    });
    
    fs.unlink(process.cwd() + '/thumbnails/' + name, function(err) {
        // err3 = err;
        if (err) console.log('Delete error in thumbnails ' + err);
        count--;
        done();
    });
    
    
    
}

exports.handlePost = function(req, res) {
    console.log('deleteImg is handling post!!');
    
    var data = '';
    req.on('data', function(chunk) {
        data+=chunk;
    });
    
    req.on('end', function() {
        try {
            console.log(data);
            data = JSON.parse(data);
            deleteImg(res, data.name);
        } catch(e) {
            console.log(e);
            sendResponse(res, { success:false, error:'non-JSON received!!!' });
            // res.end();
        } 
    });
        
    req.on('error', function(e) {
        sendResponse(res, { success: false, reason: e });
    });
            
}; 
