# Assignment 08 - Gym & Fitness Club Management REST API

A backend REST API for managing gym members, memberships, fitness classes, bookings, and authentication.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js Local Strategy
- Express Session
- bcryptjs
- dotenv
- cors

## Project Structure

assignment-08-gym-api/
├── config/
│   ├── db.js
│   └── passport.js
├── controllers/
│   ├── authController.js
│   ├── classController.js
│   └── memberController.js
├── middleware/
│   ├── authMiddleware.js
│   └── checkActiveMember.js
├── models/
│   ├── FitnessClass.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── classRoutes.js
│   └── memberRoutes.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md

## Installation

1. Make sure Node.js and MongoDB are installed.

2. Open a terminal inside this project folder.

3. Install dependencies:

npm install

4. Create a .env file by copying .env.example.

Mac/Linux:

cp .env.example .env

Windows CMD:

copy .env.example .env

5. Update .env if your MongoDB connection is different.

## Run the Project

Development mode:

npm run dev

Normal mode:

npm start

The API runs on:

http://localhost:5000

## API Endpoints

### Authentication

POST /api/auth/register

Example body:

{
  "username": "fit_sam",
  "email": "sam@fit.com",
  "password": "mypassword",
  "membershipTier": "Gold",
  "durationMonths": 3,
  "emergencyContact": "9999999999"
}

POST /api/auth/login

Example body:

{
  "username": "fit_sam",
  "password": "mypassword"
}

GET /api/auth/me

Requires login.

POST /api/auth/logout

Requires login.

### Fitness Classes

GET /api/classes

GET /api/classes?trainer=Maria

GET /api/classes/:id

POST /api/classes

Example body:

{
  "title": "Zumba Cardio",
  "trainerName": "Maria",
  "scheduleDate": "2026-10-15T09:00:00Z",
  "durationMinutes": 60,
  "maxCapacity": 2
}

POST /api/classes/:id/book

Requires login and an active membership.

DELETE /api/classes/:id/cancel

Requires login.

### Membership

PATCH /api/members/:id/renew

Example body:

{
  "additionalMonths": 6,
  "tier": "Platinum"
}

GET /api/members/expired

Requires login.

## Testing

Recommended order:

1. Register Member 1.
2. Login as Member 1.
3. Create a class with maxCapacity 2.
4. Book the class as Member 1.
5. Register Member 2 and book the same class.
6. Register Member 3 and attempt to book the same class.
7. The third booking should fail with:
   Class capacity reached
8. Test membership renewal.
9. Test the expired members endpoint.

## MongoDB

For local MongoDB, the default connection is:

mongodb://127.0.0.1:27017/gym_management

Make sure MongoDB is running before starting the Node.js server.

## Submission

The assignment specification asks for a GitHub repository named:

itm-assignment-08-gym-api

It also asks for a Postman test suite containing class booking and membership renewal requests.
