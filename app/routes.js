
module.exports = function(app){
	// Currently the default page, Needs to be changed soon to incorporate separate pages for 
	// profile, login and the homepage
	// PRofile page, login page and homepage will have to created separately in the view also
	// and havent been created yet
	app.get('/',function(req,res){
		res.sendfile('views/homepage.html');
	});
	// Profile Page
	app.get('/profile',isLoggedIn, function(req,res){
		res.sendfile('views/profile.html');
		// Could be a .ejs file also
	});

	// Logout Page
	
	app.get('/logout',function(req,res){
		res.logout();
		res.redirect('/');
	});
	
	// Homepage (Yet to be added)
	
	// ------- Authentication Section --------
	
	// Facebook Login Settings Configuration
	
	// Send to facebook to do the authentication
	
	app.get('/auth/facebook',passport.authenticate('facebook',{scope : 'email'}));
	app.get('auth/facebook/callback',
		passport.authenticate('facebook',{
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

}

// Add Authorize part (Already Logged in / Connecting Other Social Account Part)

// Unlinking Accounts


// Route middleware to ensure the user is logged in

function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		return next();
	res.redirect('/');
}
