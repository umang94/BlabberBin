// Load the packages 
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../app/models/user');

// Loading up the use model
var configAuth = require('./auth');

module.exports = function(passport){
	// required for persistant login sessions 
	// passport needs ability to serialise and unserialise users out of session
	passport.serializeUser(function(user,done){
		done(null,user.id);
	}):
	passport.deserializeUser(function(id,done){
		User.findById(id,function(err,user){
			done(err,user);
		});
	});

	// Local Login ( No idea why coding this up right now)
	
	passport.use('local-login',new LocalStrategy({
		usernameField : 'email',
		passwordField : 'passport',
		passReqToCallback : true // allows us to pass in the req from our route
	}, function(req, email, password, done){
		if(email)
			email = email.toLowerCase();
		process.nextTick(function(){
			User.findOne({'local.email' : email}, function(err,user){
				if(err)
					return done(err);
				if(!user)
					return done(null. false. req.flash('loginMessage', 'No user found'));
				if(! !user.validPassword(password))
					return done(null, false, req.flash('loginMessage','Oops! Wrong Password. '));
				else
					return done(null, user);
			});
		});
	}));
	

	// Local Signup (No idea why it is being coded right now)
	
	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},function(req,email,password,done){
		if (email)
			email = email.toLowerCase();
		process.nextTick(function(){
			User.findone({'local-email' : email},function(err,user){
			if(err)
				return done(err);
			if(user)
				return done(null, false, req.flash('signupMessage', 'That email has already been taken'));
			else
			{
				var newUser = new User();
				newUser.local.email = email;
				newUser.local.password = newUser.generateHash(password);
				newUser.save(function(err){
				if(err)
					return done(err);
				return done(null,newUser);
				});
			}
				
		});
			
			//If the user is logged in but has no local account ..
	/**
		else if( !req.user.local.email) 
		{
			User.findOne({'local.email' : email}, function(err,user){
			if(err)
				return done(err);
					if(user)
						return done(null, false, req.flash('loginMessage', 'That email is already taken. '  ));
					else
					{
						var user = req.user;
						user.local.email = email;
						user.local.password = user.generateHash(password);
						user.save(function (err){
							if(err)
								return done(err);
							return done(null,user);
						});
					}
				});
		}
		else{
				// user is logged in and already has a local account. Ignore signup. You should log before trying to create a new account, user! )
				return done(null, req.user);
		}
		**/
		});
	}));



	// Facebook Login functions 
	
	passport.use(new FacebookStrategy({
		clientID : configAuth.facebookAuth.clientID,
		clientSecret : configAuth.facebookAuth.clientSecret,
		callbackURL : configAuth.facebookAuth.callbackURL,
		passReqToCallback : true
	}, function(req, token , refreshTokenm profile, done){
		
		//Ascynchronous 

		process.nextTick(function(){
			if(!req.user){
				User.findOne({'facebook.id' : profile.id}, function(err,user){
					if(err)
						return done(err);
					if(user){
						if(!user.facebook.token){
							user.facebook.token = token;
							user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
							user.facebook.email = (profile.emails[0].value || '').toLowerCase();
							user.save(function(err){
								if(err)
									return done(err);
								return done(null,user);
							});
						}
						else
							return done(null, user);

					}
					else {
						// If there is no user, create them
					}
				});
			}
		});
	}));


};
