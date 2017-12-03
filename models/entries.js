var mongoose = require('mongoose');
var validator = require('validator');
// Can I do sterilization here as well, Add slashes, or password hashing


// Can I do sterilization here as well, Add slashes, or password hashing


var entrySchema = mongoose.Schema({
	// entry props go here

	// needs slashes
	
	// Need to add validation for new fields, and the error messages, also pass values through
	activity: {
		type: String,
		required: [true, "Activity is a required field"],
		maxlength: [100, "Activity name is too long"]	
	},
	owner: {
		type: String,
		required: false,
		maxlength: [100, "Owner name is too long"]		
	},
	createDate: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		required: [true, "Name is a required field for a n Entry!"],
		maxlength: [50, "Entry name is too long"],
		minlength: [1, "Entry name is too short"]	
	},
	// needs email validation only here only ?? //
	dateOf:{
		type: Date,
		required: [true, "Date is a required field for an entry."]
	},
	latlon: {
		type: String,
		required: false,
		validate: {
			validator: function(v) {
				if(v != "") {
					return validator.isLatLong;
				}
			},
			//validator: validator.isLatLong,
			message: '{VALUE} is not a valid LatLon',
			isAsync: false
		}
	},
	// example of a valid latLong
	// 33.808161, -84.170196 //
	description: {
		type: String,
		required: true,
		minlength: [1, "Description length too short"],
		maxlength: [255, "Description length too long"]
	},
	rating: {
		type: Number,
		required: true,
		min: 0,
		max:10
	},
	difficulty: {
		type: Number,
		required: false,
		min:1,
		max:10
	},
	city: {
		type: String,
		required: false,
		maxlength: 100
	},
	state: {
		type: String,
		required: false,
		maxlength: 100
	}
});

// Example post body
// {
//   "name": "<p>can't</p>",
//   "email": "pie''rc@ep.com",
//   "latlon": "80.9999, 80.999",
//   "description": "This is the description",
//   "rating": "9",
//   "difficulty": "5",
//   "city": "Atlanta",
//   "state": "GA"
// }


var Entry = module.exports = mongoose.model('Entry', entrySchema);


// Get Activities 

module.exports.getEntries = function(callback, limit){
	Entry.find(callback).limit(limit);
};

module.exports.getEntryById = function(id, callback){
	Entry.findById(id, callback);
};

module.exports.addEntry = function(entry, callback) {
	Entry.create(entry, callback);
};

module.exports.updateEntry = function(_id, entry, options, callback) {
	var query = {_id: _id};

	var updatedEntry = {
		name: entry.name,
		activity: entry.activity,
		description: entry.description,
		rating: entry.rating,
		difficulty: entry.difficulty,
		dateOf: entry.dateOf,
		city: entry.city,
		state: entry.state,
		latlon: entry.latlon
	};

	Entry.findOneAndUpdate(query, updatedEntry, options, callback);
};

module.exports.deleteEntry = function(_id, callback) {
	var query = {_id: _id};
	Entry.remove(query, callback);
};

