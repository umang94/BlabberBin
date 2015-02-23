// Loading things we need

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;
// User Schema for the the user model, only for local and facebook login as of now

var UserSchema = mongoose.Schema({
	local : {
		email : String,
    		password : String,
    		conversations : {
			Friend_ID : ObjectId,
    			Recent_Convo_ID : ObjectId
		}
	},
    	facebook : {
		id : String,
    		token : String,
    		email : String,
    		name : String,
	},
	twitter : {
		id : String,
    		token : String,
    		displayName : String,
    		username : String
	},
    	google : {
		id : String,
    		token : String,
    		email : String,
		name : String
	}
});


UserSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password,bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password,this.local.password);
};

// Creating the model for Users and exposing it to the rest of the app
module.exports = mongoose.model('User',UserSchema);
