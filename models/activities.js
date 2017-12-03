var mongoose = require('mongoose');



// name needs to slashed
var activitySchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name is a required field for an Activity!"],
		maxlength: [50, "Activity name is too long"],
		minlength: [1, "Activity name is too short"]	
	},
	create_date: {
		type: Date,
		default: Date.now
	}
});

// Makes the model available outside of this file
var Activity = module.exports = mongoose.model('Activity', activitySchema);

// Get Activities 

module.exports.getActivities = function(callback, limit){
	Activity.find(callback).limit(limit);
};

module.exports.getActivitiesById = function(id, callback){
	Activity.findById(id, callback);
};

module.exports.addActivity = function(activity, callback) {
	Activity.create(activity, callback);
};

module.exports.updateActivity = function(_id, activity, options, callback) {
	var query = {_id: _id};

	var updatedActivity = {
		name: activity.name
	};

	Activity.findOneAndUpdate(query, updatedActivity, options, callback);

};

module.exports.deleteActivity = function(_id, callback) {
	var query = {_id: _id};
	Activity.remove(query, callback);
};



