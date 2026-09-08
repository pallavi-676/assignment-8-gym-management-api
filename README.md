# 🏋️‍♂️ Assignment 08: Gym & Fitness Club Management REST API

## 📌 Project Overview

This project is a backend REST API for a Gym & Fitness Club Management System built using Node.js, Express.js, MongoDB, and Mongoose.

The API manages gym memberships, membership expiry and renewal, fitness classes, class bookings, seat capacity, and user authentication using Passport.js with session-based authentication.

The project also uses bcryptjs for password hashing and dotenv for environment configuration.

## 🎯 Objectives

The main objectives of this assignment are:

- Implement persistent gym membership management.
- Calculate membership expiry dates automatically.
- Track active, expired, and frozen membership statuses.
- Allow members to renew their memberships.
- Create and manage fitness classes.
- Allow authenticated members to book fitness classes.
- Prevent bookings when a class reaches its maximum capacity.
- Prevent expired members from booking classes.
- Implement session-based authentication using Passport.js.
- Store passwords securely using bcrypt hashing.

## 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- Passport Local Strategy
- Express-Session
- bcryptjs
- dotenv
- CORS
- Postman

## 📦 Installation

Install the project dependencies:

npm install

Start the development server:

npm run dev

The API runs on port 5050.

## 🔐 Environment Variables

The project uses .env.example as a reference for the required environment variables.

## 🗄️ Database Models

### User Model

The User model stores gym member information including:

- Username
- Email
- Hashed password
- Membership tier
- Membership status
- Membership expiry date
- Emergency contact
- Created and updated timestamps

Membership tiers:

- Bronze
- Silver
- Gold
- Platinum

Membership statuses:

- Active
- Expired
- Frozen

### FitnessClass Model

The FitnessClass model stores:

- Class title
- Trainer name
- Schedule date
- Duration
- Maximum capacity
- Enrolled members

Enrolled members are stored using references to User documents.

## 🔑 Authentication

The application uses Passport.js Local Strategy for authentication.

Authentication includes:

- Member registration
- Member login
- Session-based authentication
- Current member profile
- Logout
- Password hashing using bcryptjs

Authenticated routes require a valid user session.

## 🌐 API Endpoints

### Authentication

POST /api/auth/register

Registers a new gym member and calculates the membership expiry date.

POST /api/auth/login

Authenticates a member using Passport.js and creates a session.

GET /api/auth/me

Returns the currently authenticated member's profile and membership information.

POST /api/auth/logout

Logs out the currently authenticated member and destroys the session.

### Fitness Classes

GET /api/classes

Returns upcoming fitness classes.

GET /api/classes/:id

Returns details of a specific fitness class including enrolled members.

POST /api/classes

Creates a new fitness class.

POST /api/classes/:id/book

Books the authenticated member into a fitness class.

A booking is rejected when:

- The class has reached maximum capacity.
- The member's membership has expired.
- The member is not authenticated.

DELETE /api/classes/:id/cancel

Cancels the authenticated member's booking from a fitness class.

### Membership Management

PATCH /api/members/:id/renew

Renews or extends a member's membership expiry date and can update the membership tier.

Example request:

{
  "additionalMonths": 6,
  "tier": "Platinum"
}

GET /api/members/expired

Returns members whose memberships have expired.

## 📁 Project Structure

<pre>
Pallavi_sarovar_SamAltman8/
└── assignment-08-gym-api/
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
    ├── postman/
    │   └── Gym-API.postman_collection.json
    ├── routes/
    │   ├── authRoutes.js
    │   ├── classRoutes.js
    │   └── memberRoutes.js
    ├── .env.example
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    ├── README.md
    └── server.js
</pre>

## 🧪 Testing

The API was tested using Postman.

The following functionality was tested successfully:

- Member registration
- Member login
- Member profile retrieval
- Fitness class creation
- Successful class booking
- Class capacity validation
- Membership renewal
- Expired member detection
- Member logout

### 📸 1. Member Registration

The registration endpoint successfully created a new gym member and calculated the membership expiry date.

<img width="1271" height="769" alt="Screenshot 2026-09-07 at 20 51 53" src="https://github.com/user-attachments/assets/c111b32d-e743-4977-9e96-181f1d6fbd62" />

### 📸 2. Member Login

The login endpoint successfully authenticated the registered member using Passport.js session-based authentication.

<img width="1271" height="769" alt="Screenshot 2026-09-07 at 20 53 07" src="https://github.com/user-attachments/assets/7d23ed04-a0e1-47b8-bed0-d7801f47d0ac" />

### 📸 3. My Profile

The profile endpoint successfully returned the authenticated member's details and remaining membership days.

<img width="1271" height="769" alt="Screenshot 2026-09-07 at 20 53 40" src="https://github.com/user-attachments/assets/717cb94a-ad8b-469f-b3a3-a9a3c0d4e132" />

### 📸 4. Fitness Class Creation

A fitness class was successfully created with a maximum capacity of 2 members.

<img width="1271" height="769" alt="Screenshot 2026-09-07 at 20 53 56" src="https://github.com/user-attachments/assets/d72c2a2a-7291-408a-9b50-5267391abb41" />

### 📸 5. Successful Class Booking

An authenticated active member successfully booked a fitness class.

<img width="1271" height="769" alt="Screenshot 2026-09-07 at 20 54 43" src="https://github.com/user-attachments/assets/781cc905-d3b6-45dd-a4e6-e499b3a9732d" />

### 📸 6. Class Capacity Validation

After two members filled the class, a third booking attempt was rejected because the class had reached its maximum capacity.

The API returned:

400 Bad Request

Class capacity reached

This confirms that the API prevents over-enrollment.

| Successful Booking | Capacity Reached |
|:---:|:---:|
| <img width="500" alt="Successful class booking" src="https://github.com/user-attachments/assets/7d77a361-8326-4acd-b6c1-a88c0f91868f" /> | <img width="500" alt="Class capacity reached" src="https://github.com/user-attachments/assets/f65ce894-b89b-46ad-90f7-2cf58f702f85" /> |


### 📸 7. Membership Renewal

The membership was successfully renewed and the membership tier was updated to Platinum.

<img width="1271" height="769" alt="Screenshot 2026-09-07 at 21 01 24" src="https://github.com/user-attachments/assets/f131893e-4b9b-4c5f-bf1b-930efee10b5b" />


### 📸 8. Expired Member Detection

An expired member was created for testing.

GET /api/members/expired successfully returned the expired member.

<img width="1271" height="769" alt="Screenshot 2026-09-07 at 21 08 41" src="https://github.com/user-attachments/assets/63eed83d-18b0-42e0-b7de-734a8250ff3f" />

## 📮 Postman Collection

The Postman collection is included in:

postman/Gym-API.postman_collection.json

The collection contains requests for:

- Register Member
- Login
- My Profile
- Create Fitness Class
- Get Upcoming Classes
- Get Class By ID
- Book Class
- Cancel Booking
- Renew Membership
- Get Expired Members
- Logout

## 🏗️ Project Features

- MongoDB database integration using Mongoose
- Mongoose schemas and relationships
- Membership expiry date handling
- Membership status management
- Mongoose pre-save middleware
- Passport.js Local Strategy authentication
- Express session authentication
- bcrypt password hashing
- Fitness class management
- Class booking and cancellation
- Class capacity validation
- Active membership validation
- Membership renewal
- Expired membership detection
- Modular controllers, routes, models, and middleware
- HTTP status codes and error handling
- Postman API testing

## 📊 Assignment Requirements Covered

This project covers the major requirements of Assignment 08:

- Mongoose schemas with date handling and enum constraints
- Membership expiry calculation
- Membership renewal
- Membership status checking
- Passport.js session authentication
- bcrypt password hashing
- Fitness class management
- Class booking and cancellation
- Class capacity validation
- Expired member detection
- Modular project architecture
- Error handling and HTTP status codes
- Postman testing

## 👩‍💻 Author

Pallavi Sarovar

Assignment 08: Gym & Fitness Club Management REST API

## 📌 Notes

The MongoDB connection is configured using environment variables.

Sensitive information such as MongoDB credentials and session secrets should not be committed to GitHub.

The project includes a Postman collection for testing the API endpoints.

The implementation follows the requirements specified for Assignment 08: Gym & Fitness Club Management REST API.
