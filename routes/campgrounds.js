let express 	= require("express"),
	router		= express.Router(),
	Campground 	= require("../models/campground"),
	Comment		= require("../models/comment"),
	User		= require("../models/user"),
	middleware 	= require("../middleware/index.js");
// ------------
// INDEX
// ------------
router.get("/index", function(req, res){
	// Get all campgrounds from db
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			// console.log(campgrounds);
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
		}
	})
});
// ------------
// NEW - GET
// ------------
router.get("/index/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});
// ------------
// NEW - POST
// ------------
router.post("/index", middleware.isLoggedIn, function(req, res){
    let name = req.body.name;
	let price = req.body.price;
    let image = req.body.image;
	let desc = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
    let newCampground = {name: name, price: price, image: image, description: desc, author: author};
    // Create a new campground and save to db
	Campground.create(newCampground, function(err){	// function(err, newCampground)?
		if(err){
			console.log(err);
		} else {
			// redirect back to campgrounds page
			res.redirect("/campgrounds/index");	
		}
	});
});
// ------------
// SHOW INFO
// ------------
router.get("/index/:id", function(req, res){
	// Find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});
// ------------
// EDIT
// ------------
router.get("/index/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});
// ------------
// UPDATE
// ------------
router.put("/index/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds/index/");
		}else{
			res.redirect("/campgrounds/index/" + req.params.id);
		}
	});
});
// ------------
// DESTROY
// ------------
router.delete("/index/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndDelete(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds/index");
		}else{
			res.redirect("/campgrounds/index");
		}
	});
});

module.exports = router;