let express 	= require("express"),
	router		= express.Router({mergeParams: true}),
	Campground 	= require("../models/campground"),
	Comment		= require("../models/comment"),
	middleware 	= require("../middleware/index.js");

// ====================================
// COMMENTS ROUTES
// ====================================

// let isLoggedIn = Index.isLoggedIn();
//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});
		}
	});
});
// Comments Create
router.post("/", function(req, res){
	// Lookup campground using id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("campgrounds/index");
		}else{
		// Create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				}else{
					// Connect new comment to campground
					// username and id to comment and then save comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save()
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/index/" + campground._id);
				}
			});
		// redirect to campground show page	
		}
	});
});
// Comments Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			}else{
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
		});
	});
});
// Comments Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/index/" + req.params.id);
		}
	});
});
// Comment Delete
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndDelete(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			//res.flash("success", "Comment successfully deleted");
			res.redirect("/campgrounds/index/" + req.params.id);
		}
	});
});

module.exports = router;