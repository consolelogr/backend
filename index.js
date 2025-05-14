const express = require('express')
const app = express()
const morgan =require('morgan')

app.use(express.json())

morgan.token('body', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : '';
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);




let persons =[
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const kello = new Date()

const generateId = () => {
  
  const newId = Math.floor(Math.random()*123456789)
   //Tee jotain tarkistuksia
  console.log('Generated Id:' + newId)
  return(newId)
  
}





app.get('/', (request, response) => {
  
  response.send('<h1>It is a fine day today!</h1>') 
 })

 app.get('/info', (request, response) => {
	response.send  
  ('There are ' + persons.length + ' persons in the phonebook' + '<br>' + '<br>' + 'Time: ' + kello.getHours() + ':' + kello.getMinutes() + ':' + kello.getSeconds() + ':' + kello.getMilliseconds() + '<br>' + 'Timezone: ' +  (kello.getTimezoneOffset()/60) + ' GMT' + '<br>' + 'Date: ' + kello.getDate() + '/' + (kello.getMonth() + 1) + '/' + kello.getFullYear() 
     ) 
 })


 app.post('/api/persons', (request, response) => {
  const person = request.body;

  if (!person.name || !person.number) {
    return response.status(400).json({ error: 'name or number is missing' });
  }

  const nameExists = persons.find(p => p.name === person.name);
  if (nameExists) {
    return response.status(400).json({ error: 'name must be unique' });
  }

  const newPerson = {
    id: generateId().toString(), 
    name: person.name,
    number: person.number
  };

  persons = persons.concat(newPerson);
  response.status(201).json(newPerson); 
});


app.get('/api/persons', (request, response) => {
  generateId();
  response.json(persons)
  })

  app.delete('/api/persons/:id', (request, response) => {
    
    const id = request.params.id
    person = persons.filter(person => person.id !== id)
  
    response.status("error jotain")
  })

app.get('/api/persons/:id', (request, response) => {
	const id = request.params.id
	const person = persons.find(person => person.id === id)
  if (person) {
	  response.json(person)
	} else {
      response.status(404).send('<h1>404 Not Found</h1><p>The resource you are looking for does not exist.</p>');
    
    
	}
  })  
 
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