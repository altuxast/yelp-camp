let express 			= require("express"),
	app 				= express(),
	session				= require("express-session"),
	bodyParser 			= require("body-parser"),
	mongoose 			= require("mongoose"),
	flash				= require("connect-flash"),
	passport			= require("passport"),
    LocalStrategy 		= require("passport-local"),
	methodOverride		= require("method-override"),
	MongoDBStore		= require("connect-mongodb-session")(session),
    Campground  		= require("./models/campground"),
    Comment     		= require("./models/comment"),
    User        		= require("./models/user"),
	seedDB				= require("./seeds"),
	dotenv				= require("dotenv").config();	

let commentRoutes		= require("./routes/comments"),
	campgroundRoutes	= require("./routes/campgrounds"),
	indexRoutes			= require("./routes/index");

// seedDB(); // remove campgrounds from database
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

// mongoose.connect("mongodb://localhost/yelp_camp");
// mongodb+srv://altuxast:<password>@cluster0-nu2cb.mongodb.net/test?retryWrites=true&w=majority
// mongodb+srv://altuxast:<password>@cluster0-nu2cb.mongodb.net/test?retryWrites=true&w=majority
const 	user 		= process.env.DB_USER,
		password 	= process.env.DB_PASS;

const URI 	= 'mongodb+srv://' + user + ':' + password + '@cluster0-nu2cb.mongodb.net/test?retryWrites=true&w=majority', // nothing on 27016 
	  OPTS 	= { useNewUrlParser: true, useCreateIndex: true };
// mongoose.connect(URI, OPTS).then(() => {
// 	console.log("Connected to db");
// }).catch(err => {
// 	console.log("ERROR:", err.message);
// });

let store = new MongoDBStore({uri: URI, collection: "YCSessions"}, () => {
	console.log("Connected to db");
});

// catch errors
store.on("error", err => {
	console.log(err.message)
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
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
	},
	store: store,
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

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("Server started ...");
});