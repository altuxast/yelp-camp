let express 	= require("express"),
	router		= express.Router(),
	passport 	= require("passport"),
	User		= require("../models/user"); 

router.get("/", function(req, res){
    res.render("landing");
});

// ====================================
// AUTH ROUTES
// ====================================

// Show register form
router.get("/register", function(req, res){
	res.render("register", {page: "register"});
});
// Handle sign up logic
router.post("/register", function(req, res){
	let newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		// if(err){
		// 	req.flash("error", err.message);
		// 	return res.render("register");
		// }
		if(err){
			console.log(err);
			return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds/index");
		});
	});
});
// Show log in form
router.get("/login", function(req, res){
	res.render("login", {page: "login"});
});
// Handle log in logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds/index",
	failureRedirect: "/login"
}), function(req, res){

});
// Logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("campgrounds/index");
});

module.exports = router;