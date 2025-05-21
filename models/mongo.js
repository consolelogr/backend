const mongoose = require('mongoose')


const connectDB =() => {
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]


const url = `mongodb+srv://koekaniini:${password}@fso.i5cuyfc.mongodb.net/phonebook?retryWrites=true&w=majority&appName=FSO`


mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  content: String,
    number: String,
  important: Boolean,
})

const Person = mongoose.model('Person', personSchema, 'persons')

const person = new Person({
  content: 'HTML is easy',
  number: '123456789',
  important: true,
})

/*
person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})
*/

Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})
}

module.exports = connectDB; 