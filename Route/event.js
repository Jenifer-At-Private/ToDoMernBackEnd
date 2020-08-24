const express = require('express')
const router = express.Router()

const { getEventById, addUserEvent, getEvent, updateEvent, eventScheduleList, removeEvent } = require('../Controller/event.js')
const {isSignedIn, isAuthenticated} = require('../Controller/auth.js')
const { getUserById } = require('../Controller/user.js')

router.param('userId', getUserById)
router.param('eventId', getEventById)

router.post('/user/:userId/addEvent', isSignedIn, isAuthenticated, addUserEvent)

router.get('/user/:userId/event/:eventId', isSignedIn, isAuthenticated, getEvent)

router.put('/user/:userId/:eventId/updateEvent', isSignedIn, isAuthenticated, updateEvent)

router.get('/user/:userId/event/:eventId/scheduleList', isSignedIn, isAuthenticated, eventScheduleList)

router.delete('/user/:userId/event/:eventId', isSignedIn, isAuthenticated, removeEvent)

module.exports = router;