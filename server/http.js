var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var util = require('util');


http.createServer(function(req, res){
   
   var pathname = url.parse(req.url).pathname;
   
   
   console.log("Request for " + pathname + " received.");
   
   if(pathname == "/write"){
    var post = '';  

    req.on('data', function(chunk){   
        post += chunk;
    });

    req.on('end', function(){   
		fs.writeFile("items.csv", post, function (err) {
		  if (err) return console.log(err);
		  console.log(post +"->"+"input.csv");
		});
        post = querystring.parse(post);
        res.end(util.inspect(post));
    });
   } else if(pathname == "/read"){
	   
	   fs.readFile("items.csv", function (err, data) {
		  if (err) {
			 console.log(err);
			 
			 // Content Type: text/plain
			 res.writeHead(404, {'Content-Type': 'text/html'});
		  }else{	         
			 
			 // Content Type: text/plain
			 res.writeHead(200, {
				 'Content-Type': 'text/html',
				 'Access-Control-Allow-Origin': '*'
				 });	
			
			 res.write(data.toString());		
		  }
		  
		  res.end();
	   })
   }
}).listen(process.env.PORT || 3000);


console.log('Server running at test http://127.0.0.1:3000/');