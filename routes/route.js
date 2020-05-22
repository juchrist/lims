var express = require("express");
//var passport= require("passport");

//var User = require("./models/user");
var router = express.Router();
/*router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});*/

/*router.get("/", function(req, res, next) {
  User.find()
  .sort({ createdAt: "descending" })
  .exec(function(err, users) {
    if (err) { return next(err); }
    res.render("index", { users: users });
  });
});*/

//Index View
router.get("/",function(req,res){
  res.render("login",{
    title:'Library Management System Software'
  });
});



//Sign Up View
router.get("/signup", function(req, res) {
  res.render("signup");
});

//Sign Up Controller
router.post("/signup",function(req,res){
  var username = req.body.username;
  var password = req.body.password;

});

router.post("/login",function(req,res){
  //res.render("login");
});


/*router.post("/signup", function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }
    if (user) {
      req.flash("error", "User already exists");
      return res.redirect("/signup");
    }
    var newUser = new User({
      username: username,
      password: password
    });
    newUser.save(next);
  });
}, passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/signup",
  failureFlash: true
}));*/

/*router.get("/users/:username", function(req, res, next) {
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) { return next(err); }
    if (!user) { return next(404); }
    res.render("profile", { user: user });
  });
});*/

module.exports = router;
