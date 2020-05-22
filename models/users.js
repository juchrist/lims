var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var SALT_FACTOR = 10;

var userModel = mongoose.Schema({
  username:{type: String, required: true},
  password:{type: String, required: true},
  createdAt:{type: Date, default: Date.now},
  displayName: {type: String},
  bio: {type: String}
});


//Pre-save action to hash the password (in models/user.js)
var noop = function() {};
userModel.pre("save", function(done) {
  var user = this;
  if (!user.isModified("password")) {
    return done();
  }
  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) { return done(err); }
    bcrypt.hash(user.password, salt, noop,
     function(err, hashedPassword) {
      if (err) { return done(err); }
      user.password = hashedPassword;
      done();
    });
  });
});

// Checking the user’s password (in models/user.js)
userModel.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

//Adding a simple method to the user model (in models/user.js)
userModel.methods.name = function() {
  return this.displayName || this.username;
};

var User = mongoose.model("User", userModel);
module.exports = User;
