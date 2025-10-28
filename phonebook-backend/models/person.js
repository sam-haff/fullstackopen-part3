// I didn't include the init code as it's illogical
// for connection code to be in the model file.

const mongoose = require('mongoose')

const schema = mongoose.Schema( {
  name: {
    type: String,
    minLength: 3
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: v => /\d{3}-\d+$/.test(v),
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})
schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', schema)