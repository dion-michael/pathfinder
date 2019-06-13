const mongoose = require("mongoose")
const regis = require('../helpers/bcrypt.js')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: 
  {
    type: String,
    required: [ true, 'Email is required' ],
    validate: [{
      validator: function(input) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return input.match(mailformat)
      },
      message: props => `${props.value} invalid email format!`
    }, {
      validator: function(value) {
        return User.find({
              _id: { $ne: this._id },
              email: value
          })
          .then( data => {
              if(data.length !== 0) {
                  throw 'Email has been used'
              }
          })
          .catch(err => {
              throw err
          });
      },
      message: props => `This email ${props.value} already used!`
    }], 
  },
  password: {
    type: String,
    required: [ true, 'Password is required' ],
    validate: {
      validator: function(input) {
        if (input.length > 7 && input.length < 14) return true
        else return false
      },
      message: props => `Password length must be between 8 to 13`
    }
  }
})

UserSchema.pre('save', function (next){
  this.password = regis.hashPassword(this.password)
  next()
})

const User = mongoose.model("User", UserSchema)

module.exports = User