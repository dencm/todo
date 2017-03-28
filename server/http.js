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

		var content = JSON.parse(fs.readFileSync('items.json', 'utf8'));

        post = JSON.parse(post);
		content.items.push(post);
		fs.writeFile("items.json", JSON.stringify(content), function (err) {
		  if (err) return console.log(err);
		  console.log(post +"->"+"input.csv");
		});
			 res.writeHead(200, {
				 'Content-Type': 'text/html',
				 'Access-Control-Allow-Origin': '*'
				 });	
			
			 res.write("success");
		  res.end();
    });
   } else if(pathname == "/read"){
	   
	   fs.readFile("items.json", function (err, data) {
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
			
			 res.write(JSON.stringify(JSON.parse(data).items));		
		  }
		  
		  res.end();
	   })
   } else if(pathname == "/update"){
    var post = '';  

    req.on('data', function(chunk){   
        post += chunk;
    });

    req.on('end', function(){   

		var content = JSON.parse(fs.readFileSync('items.json', 'utf8'));

        post = JSON.parse(post);
		//content.items.push(post);
		for(var row in content.items) {
			if(content.items[row].content == post.content){
				content.items[row].done = post.done;
				break;
			}
		}
		fs.writeFile("items.json", JSON.stringify(content), function (err) {
		  if (err) return console.log(err);
		  console.log(post +"->"+"input.csv");
		});
			 res.writeHead(200, {
				 'Content-Type': 'text/html',
				 'Access-Control-Allow-Origin': '*'
				 });	
			
			 res.write("success");
		  res.end();
    });
   }
}).listen(process.env.PORT || 3000);//


console.log('Server running at test http://127.0.0.1:3000/');