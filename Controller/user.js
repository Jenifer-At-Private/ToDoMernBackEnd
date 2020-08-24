const User = require('../Model/user.js')
const Event = require('../Model/event.js')
const Schedule = require('../Model/schedule.js')
const { check, validationResult } = require('express-validator');

const {isSignedIn, isAuthenticated, isAdmin} = require('../Controller/auth.js');
const { collection } = require('../Model/event.js');
const schedule = require('../Model/schedule.js');


exports.getUserById = (req, res, next, id)=>{
	User.findById(id).exec((err,user)=>{
		if(err || !user){
			return res.status(400).json({
				error: 'No User was found in DB'
			})
		}

		req.profile = user
		next()
	})
}

// exports.getTheUser = (req,res,field)=>{
// 	User.findOne(field).exec((err,user)=>{
// 		if(err || !user){
// 			return ({
// 				error: 'No User found'
// 			})
// 		}
// 		console.log(user)
// 		// return res.json(user)
// 	})
// }

exports.getUser = (req,res)=>{
	
	// console.log(req)
	req.profile.salt = ""
	req.profile.secureString = "CreatedByJeNiFeR"
	req.profile.createdAt = undefined
	req.profile.updatedAt = undefined
	return res.json(req.profile)
}

exports.updateUser = (req,res)=>{
	const errors = validationResult(req)
	// console.log(errors)

	if(!errors.isEmpty()){
		return res.status(422).json({
			error: errors.array()[0].msg
		})
	}
	User.findByIdAndUpdate(
	{_id: req.profile._id},
	{$set: req.body},
	{new: true, useFindAndModify:false},
	(err,user)=>{
		if(err){
			return res.status(400).json({
				error: 'You are not authorized to update this user'
			})
		}
		user.salt = ""
		user.secureString = 'CreatedByJeNiFeR'
		return res.json(user)
	}

	)

	
}

exports.userEventList = (req,res)=>{
	Event.find({user: req.profile._id})
	.populate('user','_id name')
	.exec((err,event)=>{
		if(err){
			return res.status(400).json({
				error: 'No event for this account'
			})
		}
		// console.log(event)
		return res.json(event)
	})
}

exports.getAllUsers = (req,res)=>{
	
	
	User.find().exec((err,user)=>{
		console.log(err,user)
		if(err || !user){
			console.log(err)
			return res.status(400).json({
				error: 'No user was in database'
			})
		}
		// console.log(user)
		return res.json(user)
	})
}





exports.removeUser = (req, res)=>{
    // Schedule.deleteMany({event: event._id})
    // .exec((err,sched)=>{
    //     // console.log(event._id)
    //     if(err || !sched){
    //         // console.log('Inside the error')
    //         return res.status(400).json({
    //             error: 'Cannot delete this Events Schedule'
    //         })
    //     }
    //     // console.log('Schedule Deleted')
    //     event.remove((err, event)=>{
    //         if(err || !event){
    //             return res.status(400).json({
    //                 error: 'Cannot delete the Schedule'
    //             })
    //         }
    //         // console.log('Event Deleted')
    //         return res.json({
    //             message: 'Successfully Event was Deleted'
    //         })
    //     })
        
	// })
	
	Event.find({user: req.profile._id})
	.exec((err, event)=>{
		// console.log(event)
		if(err){
			return res.status(400).json({
				error: 'Cannot Delete the Event'
			})
		}
		event.forEach(evt=>{
			// console.log(evt)
			Schedule.deleteMany({event: evt._id})
			.exec((err, schedule)=>{
				if(err){
					return res.status(400).json({
						error: 'Cannot delete the schedule'
					})
				}
				console.log('Schedule Deleted')
			})
		})
		
			Event.deleteMany({user: req.profile._id})
			.exec((err, event)=>{
				if(err){
					return res.status(400).json({
						error: 'Cannot delete the event'
					})
				}
				console.log('Events Deleted')
				User.deleteOne({_id: req.profile._id})
				.exec((err, user)=>{
					if(err || !user){
						return res.status(400).json({
							error: 'No user like this'
						})
					}
					console.log('User Deleted')
					return res.json({
						message: 'User is Deleted'
					})
				})
			})
		
		
	})
	
	// console.log(req.profile)
}
