const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator');

const {signout, signup, signin, isSignedIn, root} = require('../Controller/auth.js')

//Sign out route
router.get('/signout', signout)



//Sign up route
router.post('/signup', 
	[
		check("email").isEmail().withMessage('Email id is not valid'),
		check("password", "Password should be atleast 5 characters").isLength({ min: 5 })
	],
	signup
)



//Sign in route
router.post('/signin',
	[
		check('email','Email is not valid').isEmail(),
		check('password').isLength({ min : 1 }).withMessage('Password is required')
	],
	signin
)


router.get('/testroute', isSignedIn, (req,res)=>{
	res.json(req.auth)
})

module.exports = router;


router.get('/', root)