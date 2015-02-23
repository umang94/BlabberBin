// Loading mongoose

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
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

module.exports = mongoose.model('Converstation', ConversationSchema);
