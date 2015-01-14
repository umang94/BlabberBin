// Set up the HTTP server

var httpd = require('http').createServer(ServerHandler);

//Socket.io listening on the server

io = require('socket.io').listen(httpd);

// Rendering the HTML Client

var fs = require('fs');

httpd.listen(3000);

function ServerHandler(req, res){
	// Read the HTML file and render it in the response
	fs.readFile(__dirname + '/index.html',function(err,data){
		if(err){
			res.writeHead(500);
			res.end('Error loading chat view.');
		}
		else{
			res.writeHead(200);
			res.end(data);
		}
	});
}

//Handler event for the clients connection

io.sockets.on('connection',function(socket){
	//Listen for client responses, and emitting it to all the possible clients
	socket.on('clientResponse',function(response){
		// Create a response to send to all the clients
		var reply = socket.id + ": " + response;
		//Broadcast , using a "serverResponse" event
		socket.broadcast.emit('serverResponse',reply);
	});

	//Emitting a welcome message
	var welcome = socket.id + "just joined the chat. Welcome!" ;
	socket.broadcast.emit('serverResponse',welcome);
});
