const express = require('express')
const router = express.Router()

const { getScheduleById, addSchedule, updateSchedule, removeSchedule } = require('../Controller/schedule.js')
const { getEventById } = require('../Controller/event.js')
const { getUserById } = require('../Controller/user.js')
const { isSignedIn, isAuthenticated } = require('../Controller/auth.js')

router.param('scheduleId', getScheduleById)
router.param('userId', getUserById)
router.param('eventId', getEventById)

router.post('/user/:userId/event/:eventId/addSchedule/',  
    isSignedIn, 
    isAuthenticated, 
    addSchedule
)

router.put('/user/:userId/event/:eventId/schedule/:scheduleId',
    isSignedIn,
    isAuthenticated,
    updateSchedule
)

router.delete('/user/:userId/event/:eventId/schedule/:scheduleId/delete',
    isSignedIn,
    isAuthenticated,
    removeSchedule
)

module.exports = router;