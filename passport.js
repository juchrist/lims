var express = require("express");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mysql = require("mysql");
//var Strategy = require("passport-strategy");
//Creating MySQL DB Connection
var connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database: 'lims',
});

/*connection.query("USE lims");*/
module.exports = function() {
	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
		done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
		connection.query("SELECT * FROM students WHERE student_id = "+id,function(err,rows){
			done(err, rows[0]);
		});
    });

};

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        connection.query("SELECT * FROM users WHERE email = '"+email+"'",function(err,rows){
			console.log(rows);
			console.log("above row object");
			if (err)
                return done(err);
			 if (rows.length) {
                console.log("Email already exist!");
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

				// if there is no user with that email
                // create the user
                var newUserMysql = new Object();

				newUserMysql.email    = email;
                newUserMysql.password = password; // use the generateHash function in our user model

				var insertQuery = "INSERT INTO users ( email, password ) values ('" + email +"','"+ password +"')";
					console.log(insertQuery);
				connection.query(insertQuery,function(err,rows){
				newUserMysql.id = rows.insertId;

				return done(null, newUserMysql);
				});
            }
		});
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('loginController', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'student_id',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, student_id, password, done) { // callback with email and password from our form

         connection.query("SELECT * FROM `students` WHERE `student_id` = '" + student_id + "'",function(err,rows){
			if (err){
                console.log("Input Username or Password!");
                return done(err);
            }
			 if (!rows.length) {
                console.log("User Not Found!");
                return done(null, false); // req.flash is the way to set flashdata using connect-flash
            }

			// if the user is found but the password is wrong
            if (!( rows[0].password == password)){
                console.log("wrong password!");
                return done(null, false); 
            }
            
            // create the loginMessage and save it to session as flashdata
            // all is well, return successful user
//           return done(null, rows[0]);
            return done(null, rows[0]);
		});



    }));
