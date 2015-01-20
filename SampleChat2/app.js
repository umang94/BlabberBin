var express = require('express')
var app = express(), http = require('http'), server = http.createServer(app), 
io = require('socket.io').listen(server);

server.listen(8080);

// Send the index html on request
app.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html');
});

var usernames = {};

io.sockets.on('connection',function(socket){
	socket.on('sendchat',function(data){
		io.sockets.emit('updatechat',socket.username,data);
	});
	socket.on('adduser',function(username){
		socket.username = username;
		usernames[username] = username;
		socket.emit("updatechat",'SERVER','you are now connected');
		socket.broadcast.emit('updatechat','SERVER',username + 'has connected ');
		io.sockets.emit('updateusers',usernames);
	});
	socket.on('disconnect',function(){
		delete usernames[socket.username];
		io.sockets.emit('updateusers',usernames);
		socket.broadcast.emit('updatechat','SERVER',socket.username+'has disconnected');

	});
});

