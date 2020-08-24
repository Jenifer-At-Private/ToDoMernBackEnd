const mongoose = require('mongoose')
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid');

var userSchee = mongoose.Schema({
	name: {
		type: String,
		required: true,
		maxlength: 32,
		trim: true
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	secureString: {
		type: String,
		required: true
	},
	salt: String,
	events: {
		type: Array,
		default: []
	},
	role: {
		type: String,
		required: true,
		default: '0' 
	}
},{timestamps: true});

userSchee.virtual('password')
	.set(function(password){
		this._password = password
		this.salt = uuidv4()
		this.secureString = this.securePassword(password)
	})
	.get(function(){
		return this._password
	})

userSchee.methods = {

	authenticate: function(plainPassword){
		return this.securePassword(plainPassword) === this.secureString
	},

	securePassword: function(plainPassword){
		if(!plainPassword) return "";
		else{
			return crypto.createHmac('sha256', this.salt)
                   .update(plainPassword)
                   .digest('hex');
		}
	}
}

module.exports = mongoose.model("User", userSchee)

