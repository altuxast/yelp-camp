let mongoose				= require("mongoose"),
	passportLocalMongoose	= require("passport-local-mongoose");

let UserSchema	= new mongoose.Schema({
	username: String,
	password: String
});
// passportLocalMongoose(local sign methods) now available for user models
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);