
module.exports = function(app,passport){
	// Currently the default page, Needs to be changed soon to incorporate separate pages for 
	// profile, login and the homepage
	// PRofile page, login page and homepage will have to created separately in the view also
	// and havent been created yet

	// Homepage with the logi links

	app.get('/',function(req,res){
		res.render('index.ejs');
	});
	
	// Login page
	
	app.get('/login',function(req,res){
		console.log("Requesting app.get ");
		res.render('login.ejs',{message : req.flash('loginMessage')});
	});
	
	app.post('/login', passport.authenticate('local-login',{
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true

	}));
	// Showing the signup form and passing in any flash messages if they are there
	
	app.get('/signup',function(req,res){
		res.render('signup.ejs',{message: req.flash('signupMessage')});
	});

	// Processing the sign up form to happen here 
	// Passport to be used here
	 app.post('/signup',passport.authenticate('local-signup', {
		 successRedirect : '/profile',
		 failureRedirect : '/signup',
		 failureFlash : true
	 }));

	// Profile Page
	app.get('/profile',isLoggedIn, function(req,res){
		res.render('profile.ejs', {user : req.user});
		// Could be a .ejs file also
	});

	// Logout Page
	
	app.get('/logout',function(req,res){
		req.logout();
		res.redirect('/');
	});
	
	// Homepage (Yet to be added)
	
	// ------- Authentication Section --------
	
	// Facebook Login Settings Configuration
	
	// Send to facebook to do the authentication
	
//	app.get('/auth/facebook',passport.authenticate('facebook',{scope : 'email'}));
//	app.get('auth/facebook/callback',
//		passport.authenticate('facebook',{
//			successRedirect : '/profile',
//			failureRedirect : '/'
//		}));
}

// Add Authorize part (Already Logged in / Connecting Other Social Account Part)

// Unlinking Accounts


// Route middleware to ensure the user is logged in

function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		return next();
	res.redirect('/');
}
