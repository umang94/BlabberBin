var express = require('express')
var app = express(), http = require('http'), server = http.createServer(app), 
io = require('socket.io').listen(server);

server.listen(8080);

// Send the index html on request
app.get('/',function(req,res){
	res.sendfile(__dirname + '/views/homepage.html');
});

var friend_map = {};
var online_users = {};
var usernames = {};
var id_map = {};

io.sockets.on('connection',function(socket){

	socket.on('subscribe',function(friend_name){
		console.log(socket.username + " wants to add " + friend_name);
		if (friend_name in usernames)
		{
			if (socket.username in friend_map)
				friend_map[socket.username].push(friend_name);
			else
				friend_map[socket.username] = [friend_name];
		}
		socket.emit('updatefriendlist',friend_map[socket.username]);
		console.log(friend_map[socket.username]);
	});

	socket.on('sendchat',function(data){
		io.sockets.emit('updatechat',socket.username,data);
	});
	socket.on('adduser',function(username){
		socket.username = username;
		usernames[username] = username;
		id_map[username] = socket;

		socket.emit("updatechat",'SERVER','you are now connected');
		socket.broadcast.emit('updatechat','SERVER',username + 'has connected ');
		io.sockets.emit('updateusers',usernames);
	});

	socket.on('sendpmessage',function(to,message){
		console.log("This is working : " + id_map[to].username);
		console.log(socket.username + " says to " + to + " : " + message );
	});

	socket.on('disconnect',function(){
		delete usernames[socket.username];
		io.sockets.emit('updateusers',usernames);
		socket.broadcast.emit('updatechat','SERVER',socket.username+'has disconnected');

	});

});

