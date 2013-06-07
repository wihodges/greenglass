/*global require:false exports:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

exports.handlePost = function(req, res) {
    console.log("greenglass is handling post!!");
    
    var data = '';
    req.on('data', function(chunk) {
        console.log("Greenglass received data!! And the chunk is:", chunk);
        data+=chunk;
    });
    
    req.on('error', function(e) {
        console.log('error on req!!!');
        res.writeHead(200, "OK", {'Content-Type': 'text/html'});
        res.write(JSON.stringify({ success:false, error:e }));
        res.end();
    });
    
    req.on('end', function() {
        
        try {
            data = JSON.parse(data);
            console.log('data received is:', data);
            var fs = require('fs');
            console.log('about to write file');
            fs.writeFile("./www/terrariums.json", JSON.stringify(data), function(err) {
                if(err) {
                    console.log('ERROR!!!', err);
                    res.writeHead(200, "OK", {'Content-Type': 'text/html'});
                    res.write(JSON.stringify({ success:false, error:err }));
                    res.end();
                } else {
                    console.log("The file was saved!");
                    
                    res.writeHead(200, "OK", {'Content-Type': 'text/html'});
                    res.write(JSON.stringify({ success:true, error:false }));
                    res.end();
                }
            }); 
            // res.write(JSON.stringify(data));
        } catch(e) {
            console.log('Failure to parse json');
            
            res.writeHead(200, "OK", {'Content-Type': 'text/html'});
            res.write(JSON.stringify({ success:false, error:e }));
            res.end();
        }
        // empty 200 OK response for now
    });
    
}; 