const mongoose = require('mongoose')
mongoose.set('strictQuery',false)
const url = process.env.MONGODB_URI

const connectDB =() => {
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

/*mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  important: Boolean,
})   */


mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  important: Boolean,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})



const Person = mongoose.model('Person', personSchema, 'persons')

/*
const person = new Person({
  content: 'HTML is easy',
  number: '123456789',
  important: true,
})
*/

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

person.save().then(result => {
  console.log('person saved!')
  //mongoose.connection.close()
})

Person.find({}).then(result => {
  result.forEach(person => {
    console.log(`\nPhonebook: \n${person.name} \n${person.number}`);

  })
  mongoose.connection.close()
})
}

module.exports = connectDB; 