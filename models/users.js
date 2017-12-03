var mongoose = require('mongoose');
var validator = require('validator');
var userSchema = mongoose.Schema({
	



// need to write methods to crete new user, 
// get all users
// update a user 
// delete a user
// 
// validate a user

// need to create user with hashed pw.
// need to validate user by checking pw against hash - same ol stuff //
// Try and pass back a token of some sort. Or require validation with all post/put/delete requests

// test the unique and dropDups on other fields // 


	uname: {
		type: String,
		required: true,
		maxlength: [50, "Username is too long"],
		minlength: [5, "Username is too short"],
		unique : [true, "Username is already in use."], 
		dropDups: true
	},
	password: {
		type: String,
		required: true
	},
	email:{
	type:String,
	validate:{
	      validator: validator.isEmail,
	      message: '{VALUE} is not a valid email',
	      isAsync: false
	    }
	},


});

// Makes the user available outside of this file
var User = module.exports = mongoose.model('User', userSchema);

// Get Users 

module.exports.getUsers = function(callback, limit){
	User.find(callback).limit(limit);
};



module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
};





// Find by username //
// Used for validation
module.exports.getByUserName = function(username, callback) {
	var query = {uname: username};
	User.find(query, callback);
};




// Needs work
module.exports.addUser = function(user, callback) {
	User.create(user, callback);
};

// Needs work
module.exports.updateUser = function(_id, user, options, callback) {
	var query = {_id: _id};

	var updatedUser = {
		uname: user.uname,
		password: user.password,
		email: user.email
	};

	User.findOneAndUpdate(query, updatedUser, options, callback);

};

module.exports.deleteUser = function(_id, callback) {
	var query = {_id: _id};
	User.remove(query, callback);
};






var User = module.exports = mongoose.model('User', userSchema);