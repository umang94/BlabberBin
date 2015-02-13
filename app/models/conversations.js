// Loading mongoose

var mongoose = require('mongoose');

// Conversation Schema

var ConversationSchema = mongoose.Schema({
	Messages : {
		timestamp : Date,
    		source : ObjectId,
    		content : String
	},
    	Next : ObjectId,
    	Previous : ObjectId
}); 
