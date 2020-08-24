
const User = require('../Model/user.js')
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

// const {getTheUser} = require('../Controller/user.js')


//Sign up controller
exports.signup = (req,res)=>{
	
	const errors = validationResult(req)

	if(!errors.isEmpty()){
		return res.status(422).json({
			error: errors.array()[0].msg
		})
	}

	var user = new User(req.body)
	user.save((err, user)=>{
		if(err){
			return res.status(400).json({
				error: 'Not Able To save the user in the database'
			})
		}
		//res.send(user)
		return res.json({
			name: user.name,
			email: user.email,
			id: user._id
		})
	})
}


//Sign in controller
exports.signin = (req,res)=>{
	const errors = validationResult(req)
	const {email, password} = req.body


	
	if(!errors.isEmpty()){
		return res.status(422).json({
			error: errors.array()[0].msg
		})
	}



	User.findOne({email}, (err,user)=>{
		if(err || !user){
			return res.status(400).json({
				error: "Email Does not exists"
			})
		}
		if(!user.authenticate(password)){
			return res.status(401).json({
				error: 'Email and password do not match'
			})
		}


	// var user = new User(req.body)
	//Generating token
	var token = jwt.sign({_id: user._id}, process.env.SECRET)


	//Putting token into the cookie
	res.cookie('token', token, {expire: new Date() + 1000})


	//For front End
	const { _id, name, emailid, role } = user
	return res.json({ token, user: { _id, name, email, role } })

	})
}



//Sign out controller	
exports.signout = (req,res)=>{
	res.clearCookie('token')
	res.json({
		message: 'User Signed Out'
	})
}

exports.root = (req,res)=>{
	return res.json({message: 'root'})
}


//Protected routes
exports.isSignedIn = expressJwt({
	secret: process.env.SECRET,
	userProperty: 'auth'
})



//Custom Middlewares
exports.isAuthenticated = (req,res,next)=>{

	// const { auth:{_id} } = req
	// // console.log(_id)

	// User.findOne({_id: _id}, (err,user)=>{
	// 	if(err || !user){
	// 		return res.status(400).json({
	// 			error: "Email Does not exists"
	// 		})
	// 	}
		
	
	

	let checker = (req.profile && req.auth) && (req.profile._id == req.auth._id )
	// || user.role == '1' )
	// console.log(req.profile)

	// console.log(user)
	
	if(!checker){
		return res.status(403).json({
			error: 'ACCESS Denied'
		})
	}

	next()
// })
}


exports.isAdmin = (req,res,next)=>{
	// admin = getTheUser({_id: req.auth._id})
	let admin = ''
	User.findOne({_id: req.auth.id}).exec((err,user)=>{
		if(err || !user){
			return ({
				error: 'No User found'
			})
		}
		// console.log(user)
		
		// console.log('ADMIN: '+admin.role)
		// return res.json(user)
	
	
	
	if(req.profile.role === '0' || user.role === '0'){
		return res.status(403).json({
			error: 'Only for admin, ACCESS Denied'
		})
	}
})
	next()
}



