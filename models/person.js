const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  important: Boolean,
})


console.log('connecting to', url)
mongoose.connect(url)
  
.then(result => {
     console.log('connected to mongodb atlas'); 
  })
.catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

async function addNewPerson() {
  const newPerson = new Person({
    name: 'Test User 2705',
    number: '1111123-4567890'
  });

  await newPerson.save();
  console.log(`➕ Added ${newPerson.name} to MongoDB`);
}

module.exports = mongoose.model('Person', personSchema, 'persons');

