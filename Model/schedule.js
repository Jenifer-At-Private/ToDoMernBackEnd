const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

var scheduleSchee = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	completed: {
		type: Boolean,
		default: false,
		required: true
	},
	event: {
		type: ObjectId,
		ref: 'Event'
	},
	description: {
		type: String
	}
}, { timestamps: true}
)

module.exports = mongoose.model('Schedule',scheduleSchee)