// const router = express.Router()

const Event = require('../Model/event.js')
const Schedule = require('../Model/schedule.js')
// const schedule = require('../Model/schedule.js')
// const { getUserById } = require('../Controller/user.js')

// router.param('userId', getUserById)



exports.getEventById = (req, res, next, id)=>{
    Event.findById(id).exec((err,event)=>{
        if(err || !event){
            return res.status(400).json({
                error: 'No event found'
            })
        }
        req.event = event
        next()
    })
    
}




exports.addUserEvent = (req,res)=>{
    req.body.user = req.profile._id
    var event = new Event(req.body)
    // console.log(req.body)
    event.save((err,event)=>{
        if(err || !event){
            // console.log(event)
            return res.status(400).json({
                error: 'Event cannot be added'
            })
        }
        // console.log(event)
        return res.json(event)
    })
    
}




exports.getEvent = (req,res)=>{
    req.event.createdAt = undefined,
    req.event.updatedAt = undefined
    return res.json(req.event)
}



exports.updateEvent = (req,res)=>{
    Event.findByIdAndUpdate(
        {_id: req.event._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err,event)=>{
            if(err){
                res.status(400).json({
                    error: 'You are not Authorized to update the user'
                })
            }
            return res.json(event)
        }
    )
}



exports.eventScheduleList = (req, res)=>{
    Schedule.find({event: req.event._id})
    .populate('event', '_id name')
    .exec((err,schedule)=>{
        if(err){
            return res.status(400).json({
                error: 'No schedule in this event'
            })
        }
        // console.log(schedule)
        return res.json(schedule)
    })
}



// exports.removeEvent = (req, res)=>{
//     const event = req.event

//     event.remove((err, event)=>{
//         if(err || !event){
//             return res.status(400).json({
//                 error: 'Cannot delete the Event'
//             })
//         }
//         else{
//             Schedule.deleteMany({event: event._id})
//         }
//         return res.json({
//             message: 'Successfully Deleted'
//         })
//     })
// }

exports.removeEvent = (req, res)=>{
    const event = req.event

    // Schedule.find({event: event._id})
    // .exec((err, schedule)=>{
    //     if(err || !schedule){
    //         return res.status(400).json({
    //             error: 'Cannot fetch the details'
    //         })
    //     }
    //     return res.json({
    //         message: 'Successfully Fetched'
    //     })
    // })
    
    Schedule.deleteMany({event: event._id})
    .exec((err,sched)=>{
        // console.log(event._id)
        if(err || !sched){
            // console.log('Inside the error')
            return res.status(400).json({
                error: 'Cannot delete this Events Schedule'
            })
        }
        // console.log('Schedule Deleted')
        event.remove((err, event)=>{
            if(err || !event){
                return res.status(400).json({
                    error: 'Cannot delete the Schedule'
                })
            }
            // console.log('Event Deleted')
            return res.json({
                message: 'Successfully Event was Deleted'
            })
        })
        
    })

 }
