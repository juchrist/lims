var express = require("express");
var passport= require("passport");
var mysql = require("mysql");
//var login = require("./passport");
//var User = require("./models/user");
var router = express.Router();
var fs = require("fs");
var auth = require("./login_auth");
var session_store;
var connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database: 'lims',
});
connection.connect();

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
    title: 'Welcome to LiMS'
  });
});

/*router.post("/loginController",function(req,res){
  var matric_nos = req.body.matric_nos;
  var password = req.body.password;

});*/
router.post("/loginController", passport.authenticate("loginController", {
  successRedirect: "/dashboard",
  failureRedirect: "/",
//  failureFlash: true
}));

//Sign Up View
router.get("/signup", function(req, res) {
  res.render("signup");
});

//Sign Up Controller
router.post("/signup",function(req,res){
  var username = req.body.username;
  var password = req.body.password;

});

/*router.post("/login",function(req,res){
  //res.render("login");
});*/

//Dashboard View
router.get("/dashboard",function(req,res){
  res.render("dashboard",{
    title: 'Lims | Dashboard',
    menu: 'Dashboard'
  });
});

//Add Contents View
router.get("/add_content",function(req,res){
    res.render("add_content",{
      menu:'Add New Content'
    });
});

//Add New Book Controller
router.post("/add_content/books",function(req,res,next){
      var name = req.body.name;
  		var description = req.body.description;
  		var page_number = req.body.page_number;
  		var author = req.body.author;
      var yop = req.body.yop;
      var publisher = req.body.publisher;
      var isbn = req.body.isbn;
      var file_name = req.files.content.name;
      var file_path = req.files.content.path;
      var file_type = req.files.content.type;

    if(file_type == 'application/msword'||'application/vnd.openxmlformats-officedocument.wordprocessingml.document'||'application/vnd.ms-powerpoint'||'application/pdf'||'application/rtf'||'application/vnd.openxmlformats-officedocument.presentationml.slide'||'text/plain'){
      var file = __dirname + "/contents/" + req.files.content.name;
       fs.readFile( req.files.content.path, function (err, data) {
            fs.writeFile(file, data, function (err) {
             if( err ){
                  console.log( err );
             }else{
               var newContent = {
                 name: name,
                 description : description,
                 pages : page_number,
                 author: author,
                 yop : yop,
                 publisher : publisher,
                 ISBN : isbn,
                 content_type : 'b'
               }
               var insert_sql = 'INSERT INTO contents SET ?';

           var query = connection.query(insert_sql,newContent,function(err,result){
             if(err)
             console.log(err);
             else {
               console.log("inserted");
               res.redirect("/dashboard");
             }
           });

                   response = {
                       message:'File '+req.files.content.name+' uploaded successfully',
                       filename:req.files.content.name
                  };
              }
              console.log( response );
            //  res.end( JSON.stringify( response ) );
           });
       });
     }else{
       console.log("The File"+req.files.content.name+" you are trying to upload is not a document!");
//       res.end();
     }
//      console.log("You are trying to upload file"+file_name);
});

//Add Audio_Visuals Controller
router.post("/add_content/audio_visuals",function(req,res,next){
      var name = req.body.name;
  		var description = req.body.description;
      var file_name = req.files.content.name;
      var file_path = req.files.content.path;
      var file_type = req.files.content.type;
      var file_length = req.files.content.length;


    if(file_type == 'application/msword'||'application/vnd.openxmlformats-officedocument.wordprocessingml.document'||'application/vnd.ms-powerpoint'||'application/pdf'||'application/rtf'||'application/vnd.openxmlformats-officedocument.presentationml.slide'||'text/plain'){
      var file = __dirname + "/contents/" + req.files.content.name;
       fs.readFile( req.files.content.path, function (err, data) {
            fs.writeFile(file, data, function (err) {
             if( err ){
                  console.log( err );
             }else{
               var newContent = {
                 name: name,
                 description : description,
                 pages : page_number,
                 author: author,
                 yop : yop,
                 publisher : publisher,
                 ISBN : isbn,
                 content_type : 'a'
               }
               var insert_sql = 'INSERT INTO contents SET ?';

           var query = connection.query(insert_sql,newContent,function(err,result){
             if(err)
             console.log(err);
             else {
               console.log("inserted");
               res.redirect("/dashboard");
             }
           });

                   response = {
                       message:'File '+req.files.content.name+' uploaded successfully',
                       filename:req.files.content.name
                  };
              }
              console.log( response );
            //  res.end( JSON.stringify( response ) );
           });
       });
     }else{
       console.log("The File"+req.files.content.name+" you are trying to upload is not a document!");
//       res.end();
     }
//      console.log("You are trying to upload file"+file_name);
});

//Manage Content View
router.get("/manage_contents",function(req,res,next){
  var query = connection.query('SELECT * FROM contents',function(err,rows)
{
if(err)
  var errornya  = ("Error Selecting : %s ",err );
  console.log(errornya);
//req.flash('msg_error', errornya);
res.render('manage_books',{
  title:"Customers",
  menu:"All Contents",
  data:rows,
  session_store:req.session
});
console.log(rows);
});

});

//Delete Content Controller
router.get("/delete_content/:id", function(req,res,next){
  var id = req.params.id;
  var query = connection.query('DELETE FROM `contents` WHERE `id` ='+id , function(err,rows){
    if(err)
    console.log(err);
    else {
      console.log("Content Deleted!");
      res.redirect("/dashboard");
    }
  });
});

//Edit Contents
//Edit Content Controller
// View All Contents
router.get('/all_contents'/*,auth.is_login,*/, function(req, res, next) {
//	req.getConnection(function(err,connection){
        var query = connection.query('SELECT * FROM contents',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );
        console.log(errornya);
    	//req.flash('msg_error', errornya);
			res.render('all_contents',{
        title:"Customers",
        menu:"All Contents",
        data:rows,
        session_store:req.session
      });
      console.log(rows);
		});
         //console.log(rows);
     });
//});

//Delete Content Controller
router.get("/all_contents/view/:id", function(req,res,next){
  var id = req.params.id;
  var query = connection.query('SELECT * FROM `contents` WHERE `id` ='+id , function(err,rows){
    if(!err){
    console.log(err);
			res.render('view_contents',{
        title:"View Contents",
        menu:"All Contents",
        data:rows,
        session_store:req.session
      });

    }else {
      console.log("Content Downloaded!");
//      res.redirect("/dashboard");
    }
  });
});

//Manage Book View
router.get("/reviews",function(req,res){
  res.render("reviews",{
    menu: 'Reviews and Feedback'
  });
});

//Profile View
router.get("/profile",function(req,res){
  res.render("profile",{
    menu: 'Edit Profile'
  });
});

router.post("/signup", function(req, res, next) {
  var matric_nos = req.body.matric_nos;
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
}));

/*router.get("/users/:username", function(req, res, next) {
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) { return next(err); }
    if (!user) { return next(404); }
    res.render("profile", { user: user });
  });
});*/

module.exports = router;
