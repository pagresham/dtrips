
var express = require('express');
var router = express.Router();
var validator = require('validator');
var limit = 100;

// Import Models
var User = require('../models/users');
var Activity = require('../models/activities');
var Entry = require('../models/entries');

var slash = require('slashes');
var urlencode = require("urlencode");


// work on a validation route, the either returns a token, or just validates infront
// of any other route. 

const helpers = require("../utils/helpers");


router.get('/', function(req, res) {
	console.log(validator.isEmail('foo@bar.com'));
	res.send('Please use the /api/ endpoint');
})


// -- Start Routes -- //





/**
 * Tests functinality of addSlashes 
 */
router.get('/slashtest', (req, res) => {

	var output = "";
	var cnt = "hadn't";
	output += cnt + "<br>";
	console.log(cnt);
	var slashed = slash.add(cnt);
	output += slashed + "<br>";
	console.log(slashed);
	var unslashed = slash.strip(slashed);
	output += unslashed + "<br>";
	console.log(unslashed);	
	res.send(output);

});

router.get('/encodetest', function(req, res) {
	
	var str = helpers.encode_and_slash("<h1>it's</h1>");
	console.log(str);
	var str2 = helpers.decode_and_unslash(str);
	console.log(str2);

	console.log(helpers.strip("<h2>here it is</h2>"));

	res.send('check the logs');

});


// =====  activities  ===== // 

// get all
router.get('/api/activity', function(req, res) {
	// res.send('oh yeah')
	Activity.getActivities(function(err, result) {
		if(err)
			console.log(err.message) ;
		

		// Remove Slashes //
		// for(let entry of result) {
		// 	entry.name = slash.strip(entry.name);
		// }
		res.json(result);
	}, limit);
});


// get all ID
router.get('/api/activity/:_id', function(req, res) {
	var _id = req.params._id;
	Activity.getActivitiesById(_id, function(err, result) {
		if(err)
			throw err;
		console.log(result);
		// Remove Slashes //
		// for(let entry of result) {
		// 	entry.name = slash.strip(entry.name);
		// }
		res.json(result);
	});
});


// post new activity
router.post('/api/activity', function(req, res) {
	
	console.log("Posting to /api/activity");
	var activity = req.body;
	Activity.addActivity(activity, function(err, activity) {
		if(err) {
			console.log("DB Error posting to /api/activity");
			console.log(err.message);
			// Need to check validation, and handle error appropriately
			res.send("nothing to see now");
		}
		else {
			console.log("Activity Added:  " + activity);
			res.json(activity);
		}
		
	});
});


// update activity
router.put('/api/activity/:_id', function(req, res) {
	console.log('putting to api/activity/:_id')
	var _id = req.params._id;
	var updatedActivity = req.body;
	Activity.updateActivity(_id, updatedActivity, {}, function(err, activity) {
		if(err)
			console.log(err);
		else {
			console.log(activity);
			res.json(activity);
		}
	});
});
// Need Delete route


router.delete('/api/activity/:id', function(req, res) {
	var id = req.params.id;
	Activity.deleteActivity(id, function(err, res) {
		if (err) {
			console.log(err.message);
		}
		else {
			console.log("Deleted Activity # " + id);
		}
	});
});


// =====  entries  ===== //

// get all entries
router.get('/api/entry', function(req, res) {
	// res.send('oh yeah')
	Entry.getEntries(function(err, result) {
		if(err)
			console.log(err); 
	
		// for(var entry of result) {
		// 	entry.name = slash.strip(entry.name);
		// }
		// console.log("Result  " + result)
		res.json(result);
	}, limit);
});

// get entry by ID
router.get('/api/entry/:_id', function(req, res)  {
	var _id = req.params._id;
	Entry.getEntryById(_id, function(err, result) {
		if(err)
			throw err;

		
		res.json(result);
	});
});

// post new entry
router.post('/api/entry', function(req, res) {
	
	console.log("Posting to /api/entry");
	
	var entry = req.body;
	console.log(req.body);
	Entry.addEntry(entry, function(err, entry) {
		if(err) {
			console.log("DB Error posting to /api/entry");
			console.log(err.message);
			// Need to check validation, and handle error appropriately
		}
		else {
			console.log("Entry Added:  " + entry);
			res.json(entry);
		}
		
	});
});

// Update entry
router.put('/api/entry/:_id', function(req, res) {
	console.log("Firing the PUT route");
	console.log('putting to api/entry/:_id');

	var _id = req.params._id;
	var updatedEntry = req.body;
	console.log(updatedEntry);
	Entry.updateEntry(_id, updatedEntry, {}, function(err, entry) {
		if(err)
			console.log(err);
		else {
			console.log(entry);
			res.json(entry);
		}
	});
});


// Need Delete Entry

// Delete an existing Book
router.delete('/api/entry/:_id', function(req, res) {
	var entryid = req.params._id;
	Entry.deleteEntry(entryid, function(err, doc) {
		if(err){
			console.log("app.put/api/entry/:id DB error");
			throw err;
		}
		res.json(doc);
	});
});





module.exports = router;