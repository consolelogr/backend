require('dotenv').config();
const mongoose = require('mongoose');

// Replace with your MongoDB URI or load from .env
const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-uri-here';

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return addNewPerson();  // Step 1: Add a person
  })
  .then(() => {
    return getAllPersons(); // Step 2: Fetch all
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
  })
  .finally(() => {
    mongoose.connection.close(); // Always close connection
  });

// Define schema and model
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

// Add one person (POST-style logic)
async function addNewPerson() {
  const newPerson = new Person({
    name: 'Test User 2',
    number: '123-4567890'
  });

  await newPerson.save();
  console.log(`➕ Added ${newPerson.name} to MongoDB`);
}

// Fetch all persons
async function getAllPersons() {
  const persons = await Person.find({});
  console.log('📦 Persons in DB:');
  persons.forEach(p => console.log(`${p.name}: ${p.number}`));
}
