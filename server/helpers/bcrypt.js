const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

module.exports = {
  hashPassword: function(plainPassword) {
    return bcrypt.hashSync(plainPassword, salt)
  },
  checkPassword: function(plainPassword, hash) {
    let status = bcrypt.compareSync(plainPassword, hash)  
    return status;
  }
}