require('dotenv').config()
const express = require('express')
const app = express()
const morgan =require('morgan')
const cors = require('cors')
const Person = require('./models/person'); // Import the Person model

morgan.token('body', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : '';
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))  //for front-end build

const kello = new Date()
/*const generateId = () => {
const newId = Math.floor(Math.random()*123456789)
  console.log('Generated Id:' + newId)
  return(newId)
  //mongodb creates ID not needed here for now
  }*/


//render.com 
app.get('/', (request, response) => {
  console.log('GET / index.js')
  response.send('<h1>It is a fine day today!</h1>') 
})

app.get('/info', async (request, response, next) => {
  try {
    const count = await Person.countDocuments({});
    response.send(`There are ${count} persons in the phonebook<br><br>Time: ${new Date()}`);
  } catch (error) {
    next(error);
  }
});

/*
 app.get('/info', (request, response) => {
	response.send  
  ('There are ' + Person.length + ' persons in the phonebook' + '<br>' + '<br>' + 'Time: ' + kello.getHours() + ':' + kello.getMinutes() + ':' + kello.getSeconds() + ':' + kello.getMilliseconds() + '<br>' + 'Timezone: ' +  (kello.getTimezoneOffset()/60) + ' GMT' + '<br>' + 'Date: ' + kello.getDate() + '/' + (kello.getMonth() + 1) + '/' + kello.getFullYear() 
     ) 
 })
*/


//zibidi testi
const testPerson = new Person({ name: 'RenderTest', number: '999999' });
testPerson.save()
  .then(saved => console.log('🌱 Direct save worked:', saved))
  .catch(err => console.error('❌ Direct save failed:', err.message));



const person = new Person({
  name: 'Test User',
  number: '2905 12345'
});
await person.save();

// Save to MongoDB
person.save()
  .then(savedPerson => {
    console.log('Person saved:', savedPerson);
    // You can also send a response here if needed
  })
  .catch(error => {
    console.error('Error saving person:', error);
    });


//zibidi 
app.post('/api/persons', (request, response) => {
  const body = request.body;
  console.log('💥 Received POST /api/persons with data:', body);

  if (!body.name || !body.number) {
    console.warn('⚠ Missing name or number');
    return response.status(400).json({ error: 'name or number is missing' });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number
  });

  newPerson.save()
    .then(savedPerson => {
      console.log('✅ Saved to MongoDB:', savedPerson);
      response.status(201).json(savedPerson);
    })
    .catch(error => {
      console.error('❌ Error saving person:', error);
      response.status(500).json({ error: error.message });  // send back detailed error
    });
});


// zibidi end

/*
app.get('/api/persons', (request, response) => {
  generateId();
  response.json(Person)
  })
*/
app.get('/api/persons', async (request, response, next) => {
  try {
    const persons = await Person.find({});
    response.json(persons);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    await Person.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});
app.get('/api/persons/:id', (request, response) => {
	const id = request.params.id
	const person = Person.find(person => person.id === id)
  if (person) {
	  response.json(person)
	} else {
      response.status(404).send('<h1>404 Not Found</h1><p>The resource you are looking for does not exist.</p>');
	}
  })  

// Fetch all persons
async function getAllPersons() {
  const persons = await Person.find({});
  console.log('📦 Persons in DB:');
  persons.forEach(p => console.log(`${p.name}: ${p.number}`));
}

 
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

  
const PORT = process.env.PORT ||3001
app.listen(PORT, () => {
  console.log(`PERSON Server running on port ${PORT}`)
})



/* Morgan: 

Token Name: body
Function Definition: Takes (request) as an argument and returns something based on the request method.
If the request method is 'POST', it converts the request body to a JSON string using JSON.stringify().
Otherwise, it returns an empty string.


Logging Format: The format string ':method :url :status :res[content-length] - :response-time ms :body' specifies the information to be logged:

:method: HTTP method (e.g., GET, POST, PUT)
:url: URL of the request
:status: HTTP status code
:res[content-length]: Content length of the response
-: A separator
:response-time ms: Response time in milliseconds
:body: The JSON stringified body (if a POST request) */
