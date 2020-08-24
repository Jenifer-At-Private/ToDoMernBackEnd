//Importing Libraries
require('dotenv').config()

var mongoose = require('mongoose');
const express = require('express');
const app = express()

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

//Routes
const authRoutes = require('./Route/auth.js')
const userRoutes = require('./Route/user.js')
const eventRoutes = require('./Route/event.js')
const scheduleRoutes = require('./Route/schedule.js')


//Connection
mongoose.connect(process.env.DATABASE, {

	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
	
}).then(()=>{
	console.log('DB CONNECTED')
}).catch(()=>{
	console.log('DB NOT CONNECTED')
})

// var corsOptions = {
// 	origin: 'http://localhost:3000',
// 	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }


//Middlewaresn
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
//app.options('*', cors())

//app.use(function(req, res, next) {
//	res.header("Access-Control-Allow-Origin", "*");
//	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//	next();
//  });

  
//Routes
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', eventRoutes)
app.use('/api', scheduleRoutes)


//Ports
const port = process.env.PORT || 8000




//Starting a server
app.listen(port, ()=>{
	console.log(`The app is running in ${port}`)
})