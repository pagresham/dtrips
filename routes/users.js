
var express = require('express');
var router = express.Router();


var bcrypt = require('bcrypt-nodejs'); // This package seemed to work on Windows //


var saltRounds = 10;

var bodyParser = require("body-parser");



// Models
// 
// Error throwing here
var User = require('../models/users');
var Activity = require('../models/activities');
var Entry = require('../models/entries');

var limit = 100;


// the real route is /user/validate, but the /user is dropped in this file //
// router.post('/validate/:un/:pw', (req, res) => {
// 	var un = req.params.un;
// 	var pw = req.params.pw;
// 	console.log("in the /user/validate route: pw: " + pw + " and un: " + un);
// 	res.send("in the /user/validate route")
// });





// =====  users  ===== // 

// get all
router.get('/', function(req, res) {
	console.log("Getting all users");
	User.getUsers(function(err, result) {
		if(err)
			console.log(err.message) ;
	
		// console.log(result.length)
		res.json(result);
	}, limit);
});




// get by ID
router.get('/id/:_id', function(req, res) {
	var _id = req.params._id;
	console.log("Getting user with id1: " + _id);
	console.log("ID: " +  _id);
	User.findById(_id, function(err, result) {
		if(err) {
			console.log("DB Error at /user/find/:_id");
			// throw err
		} else {
			console.log(result);
			res.json(result);
		}
		
	});
});

// get by ID
router.get('/id/{_id}', (req, res) => {
	var _id = req.params._id;
	console.log("Getting user with id2: " + _id);
	console.log("ID: " +  _id);
	User.findById(_id, function(err, result) {
		if(err) {
			console.log("DB Error at /user/find/:_id");
			// throw err
		} else {
			console.log(result);
			res.json(result);
		}
		
	});
});






// get by Username
router.get('/uname/:uname', (req, res) => {
	var uname = req.params.uname;
	console.log("Getting user with uname: " + uname);
	console.log("Uname: " +  uname);
	User.getByUserName(uname, function(err, result) {
		if(err) {
			console.log("DB Error at /user/find/:uname");
			// throw err
		} else {
			console.log(result.length);
			res.json(result);
		}
		
	});
});




// Convert to user routes

// Figure out how to pass in the qurey paramaters, like how I am using the API
// at work
// But for now, I will be happy passing them in in form data
// Try and make a little progress on the validation / token route


// bcrypt-nodejs examples
// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });
 
// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });


// test Bcrypt
router.get('/testcrypt', function(req, res) {
	var plaintextPw = "pagresham";
	
	bcrypt.hash(plaintextPw, null, null, function(err, hash) {
    // Store hash in your password DB.
    	if(err)
    		console.log('Hashing error');
		else {
			console.log(hash);
			console.log("Balls");
			bcrypt.compare("pagresham", hash, function(err, result) {
				if(err)
					console.log("unhashing error");
				else {
					console.log("Compare result: " + result);
					res.send(result);
				}
			});
		}
	});
});


// post new user
// uses bcrypt to hash PW
router.post('/new', (req, res) => {
	console.log("Posting to /user/new");
	console.log(req.body);
	var plainTextPw = req.body.password;

	bcrypt.hash(plainTextPw, null, null, function(err, hash) {
		if(err) {
			console.log(err);
		} else {
			req.body.password = hash;
			var user = req.body;
			User.addUser(user, (err, user) => {
				if(err) {
					console.log("DB Error posting to /user/new");
					console.log(err.message);
					// Need to check validation, and handle error appropriately
					res.status(500).json({ error: 'Error entering user in DB' });
				}
				else {
					console.log("User Added:  " + user);
					res.json(user);
				}
			});
		}
	});
});


// update user
router.put('/new/:_id', (req, res) => {
	console.log('putting to /users/new/'+req.params._id);
	var _id = req.params._id;
	var updatedUser = req.body;
	console.log(updatedUser);
	User.updateUser(_id, updatedUser, {}, (err, user) => {
		if(err)
			console.log(err);
		else {
			console.log(user);
			res.json(user);
		}
	});
});
// Need Delete route


router.delete('/:id', (req, res) => {
	console.log('deleting to /user/delete/:_id');
	var id = req.params.id;
	User.deleteUser(id, function(err, result) {
		if (err) {
			console.log(err.message);
		}
		else {
			console.log("Deleted User # " + id);
			res.json(result);
		}
	});
});


/**
 * User Validation route 
 * Allows user to pass in uname and passwd to authenticate them from the Api database
 */
router.post('/validate', function(req, res) {
	var uname = req.body.uname;
	var password = req.body.password;
	// go to the DB, and check if usename is there. 
	// If so, compare password/hashed to hashed password
	// find user by username
	User.getByUserName(uname, function(err, user) {
		console.log(user.length);
		console.log(user[0].uname);

		if(err)
			console.log(err);
		else if(user.length != 1){
			console.log("Credentials were not in the Database");
		}
		else {
			console.log("length: " + user.length);
			console.log("password  " + user[0].password);
			console.log(password);
			bcrypt.compare(password, user[0].password).then(function(response) {
				if(response) {
					console.log("validation true");
					res.send(true);
				}
				else {
					console.log("validation false");
					res.send(false);
				}

			});
		}
		// if(response)
		// 	res.send(response)
		// res.send("response");
	});
}); 

router.get('/test/:v1/:v2', function(req, res) {
	console.log("oh hi");
	console.log("v1: " + req.params.v1);
	console.log("v2: " + req.params.v2);
	// console.log("Params2: " + req.params.test2);
	console.log(req.body.v1);
	// console.log(req.body.test2);
	res.send("Check the logs");
});


router.post('/test2', (req, res) => {
	console.log('route:  POST/test2');
	console.log(req.params.var1);
	console.log(req.body.var1);
	console.log(req.body.var2);
	console.log(req.body);
	res.send('check the logs');
});
router.get('/test2', (req, res) => {
	console.log('route:  GET/test2');
	// console.log(req.params.var1)
	console.log(req.body.var1);
	
	res.send('check the logs');
});

// Method 1. use a route like: router.get('/test/:v1/:v2',
// and access the vars by req.params.v1 && req.params.v2
// Method 2. use a route like router.post('/test2', (req, res)
// and access vars in req.body.<keyname>
// Make sure only ONE instance of content-Type = application/json is present
// access all body vars with 'req.body' - gives an object of body

// Test a get request with a form, to observe the url sent from it. 


module.exports = router;