const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

var eventSchee = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	completed: {
		type: Boolean,
		required: true,
		default: false
	},
	user: {
		type: ObjectId,
		ref: 'User'
		// required: true
	},
	schedules: {
		type: Array,
		default: []
	}
},
{timestamps: true}
)

module.exports = mongoose.model('Event', eventSchee)
