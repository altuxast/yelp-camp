let express 			= require("express"),
	app 				= express(),
	bodyParser 			= require("body-parser"),
	mongoose 			= require("mongoose"),
	flash				= require("connect-flash"),
	passport			= require("passport"),
    LocalStrategy 		= require("passport-local"),
	methodOverride		= require("method-override"),
    Campground  		= require("./models/campground"),
    Comment     		= require("./models/comment"),
    User        		= require("./models/user"),
	seedDB				= require("./seeds");	

let commentRoutes		= require("./routes/comments"),
	campgroundRoutes	= require("./routes/campgrounds"),
	indexRoutes			= require("./routes/index");

// seedDB(); // remove campgrounds from database
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

// mongoose.connect("mongodb://localhost/yelp_camp");
const URI 	= 'mongodb://localhost/yelp_camp', // nothing on 27016 
	  OPTS 	= { useNewUrlParser: true };
mongoose.connect(URI, OPTS, function(err) {
  if (err) { return console.error('failed');}
});

let ejs = require("ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Passport Configuration
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser 	= req.user;
	res.locals.error		= req.flash("error");
	res.locals.success		= req.flash("success");
	next(); 
});
// Acquiring Routes
app.use(indexRoutes);
app.use("/campgrounds/index/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen("3000", process.env.IP, function(req, res){
    console.log("Server started ...");
});