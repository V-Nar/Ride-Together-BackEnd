# Ride-Together

## What is Ride-Together

This API was made to gather people around rollerskating.

Are you tired of riding alone ? With this app you can meet other rollerskater by joining or organizing your own event.

You choose a place, a date and and you will be able to share your passion with other peoples !

## Data-Model

### User :

- username
- password
- role
- email

### Event :

- title
- date
- address
- city
- promoter
- isFinished

### Attendees :

- event
- user

### User Experience

The user will need to sign up then log in. He will be able to filter trough city to find already created event and will have the choice to participate. Otherwise he could simply create his own event and check his attendees.

### Tech Stack

Nodejs, Express, MongoDB , heroku & mongodb atlas

Postman Documentation link: https://documenter.getpostman.com/view/23034620/2s7YYpekUv

Heroku link : https://ride-together.herokuapp.com/api/
