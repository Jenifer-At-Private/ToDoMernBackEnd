const Schedule = require("../Model/schedule")


exports.getScheduleById = (req, res, next, id)=>{
    Schedule.findById(id).exec((err, schedule)=>{
        if(err || !schedule){
            return res.status(400).json({
                error: 'No schedule found'
            })
        }
        req.schedule = schedule
        next()
    })
}


exports.addSchedule = (req, res)=>{
    req.body.event = req.event._id
    var schedule = new Schedule(req.body)
    // console.log(req.schedule._id)
    schedule.save((err,schedule)=>{
        console.log(err,schedule)
        if(err || !schedule){
            return res.status(400).json({
                error: 'Cannot save schedule in the database'
            })
        }
        // console.log(schedule)
        return res.json(schedule)
    })
}



exports.updateSchedule = (req, res)=>{
    Schedule.findByIdAndUpdate(
        {_id: req.schedule._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err,schedule)=>{
            if(err || !schedule){
                return res.status(400).json({
                    error: 'Cannot Update the Schedule'
                })
            }
            return res.json(schedule)
        }
    )
}


exports.removeSchedule = (req, res)=>{
    const schedule = req.schedule
    // console.log(schedule)
    schedule.remove((err,schedule)=>{
        console.log(schedule)
        if(err || !schedule){
            return res.status(400).json({
                error: 'Cannot delete Schedule'
            })
        }
        
        return res.json({
            message: 'Schedule Successfully Deleted'
        })
    })
}