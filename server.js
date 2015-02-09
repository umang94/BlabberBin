var express = require('express');
// Intialising express app and socket.io listening 
var app = express(),
    http = require('http'); 

var port = process.env.PORT || 8000;

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// Making Database connection
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

//Configuration (Supposed to be commented out initially)
require('./config/passport')(passport);

//Application set up

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');

app.use(session({secret: 'umangjain'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


require("./app/routes.js")(app,passport);

//Launch APP

console.log("BlabberBin will now listen on " + port);

var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(port);
// Send the index html on request
//app.get('/',function(req,res){
//	res.sendfile(__dirname + '/views/homepage.html');
//});
var friend_map = {};
var online_users = {};
var usernames = {};
var id_map = {};

io.sockets.on('connection',function(socket){
	console.log("New connection Dectected");
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
		console.log('Send Chat EVENT');
		io.sockets.emit('updatechat',socket.username,data);
	});
	socket.on('adduser',function(username){
		console.log("ADD user event");
		socket.username = username;
		usernames[username] = username;
		id_map[username] = socket;

		socket.emit("updatechat",'SERVER','you are now connected');
		socket.broadcast.emit('updatechat','SERVER',username + 'has connected ');
		io.sockets.emit('updateusers',usernames);
	});

	socket.on('sendpmessage',function(to,message){
		console.log("Personal Message event");
		console.log("This is working : " + id_map[to].username);
		console.log(socket.username + " says to " + to + " : " + message );
		id_map[to].emit("updatechat",socket.username,message)
	});

	socket.on('disconnect',function(){
		console.log("Dosconnect Event");
		delete usernames[socket.username];
		io.sockets.emit('updateusers',usernames);
		socket.broadcast.emit('updatechat','SERVER',socket.username+'has disconnected');

	});

});
