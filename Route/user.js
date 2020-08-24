const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator');

const {getUserById, getUser, getAllUsers, updateUser, userEventList, removeUser} = require('../Controller/user.js')
const {isSignedIn, isAuthenticated, isAdmin} = require('../Controller/auth.js')

router.param('userId', getUserById)

router.get('/user/:userId', isSignedIn, isAuthenticated, getUser)

router.get('/admin/user/:userId', isSignedIn, isAdmin, getUser)

router.get('/:userId/users', isSignedIn, isAdmin, getAllUsers)

router.put('/user/:userId',[
    check("email").isEmail().withMessage('Email id is not valid'),
        // check("password", "Password should be atleast 5 characters").isLength(0) || check("password", "Password should be atleast 5 characters").isLength({ min: 5 })
        check('password').custom((value,{req})=>{
            console.log(typeof value)
            if((value !== undefined) && ( value.length > 0 && value.length <= 5)){
                throw new Error('Password should be atleast 5 characters')
            }
            else{
                return true
            }
        })
    
    
], isSignedIn, updateUser)

router.get('/user/event/:userId', isSignedIn, isAuthenticated, userEventList)

module.exports = router

router.delete('/admin/user/profile/delete/:userId', isSignedIn, isAdmin, removeUser)

router.delete('/user/profile/delete/:userId', isSignedIn, isAdmin, removeUser)
