var express = require('express')
var app = express(), http = require('http'), server = http.createServer(app), 
io = require('socket.io').listen(server);
var port = process.env.PORT || 8080;


var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//Configuration

require('./config/passport')(passport);

//Application set up

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



server.listen(8080);

console.log(__dirname);

require("./app/routes.js")(app);

// Send the index html on request
//app.get('/',function(req,res){
//	res.sendfile(__dirname + '/views/homepage.html');
//});

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
			{	
				console.log(friend_name)	;
				if(friend_map[socket.username].indexOf(friend_name) === -1)
					friend_map[socket.username].push(friend_name);
				if(! ( friend_name in friend_map ) )
					friend_map[friend_name] = [socket.username];
				else
					friend_map[friend_name].push(socket.username);
			}
			else
			{
				friend_map[socket.username] = [friend_name];
				if(! ( friend_name in friend_map ) )
					friend_map[friend_name] = [socket.username];
				else
					friend_map[friend_name].push(socket.username);
			}
		}
		console.log("Current users friends : " + friend_map[socket.username]);
		console.log("Friends friend list : " + friend_map[friend_name]);
		socket.emit('updatefriendlist',friend_map[socket.username]);
		socket.emit('updatefriendlist',friend_map[friend_name]);
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
		id_map[to].emit("updatechat",socket.username,message)
	});

	socket.on('disconnect',function(){
		delete usernames[socket.username];
		io.sockets.emit('updateusers',usernames);
		socket.broadcast.emit('updatechat','SERVER',socket.username+'has disconnected');

	});

});

