# Exercise Tracker REST API

An exercise tracking microservice built with Express and MongoDB.  
Users create accounts and add workouts to logs with POST.  
Retrieve a user's workout logs with a GET request, which accepts optional parameters to limit results.  
**\*Users should note their user ID when creating account as ID cannot be retrieved later**

### Create a New User  
    POST /api/exercise/new-user
    
### Add exercises  
    POST /api/exercise/add
    
### GET users's exercise log  
    GET /api/exercise/log?{userId}[&from][&to][&limit]
{ } = required, \[ \] = optional  
from, to = dates (yyyy-mm-dd); limit = number    

Made by [Michael Baghel](https://michaelbaghel.com/)  
Part of the [Free Code Camp](https://freecodecamp.org) curriculum

## Running locally

- Clone repo or download and unpack
- Install dependencies using npm
- Make sure you have a running Mongo database
- Add the connection URI for your MongoDB as an environment variable called MONGO_URI
- 'npm run start' to start the server on localhost


