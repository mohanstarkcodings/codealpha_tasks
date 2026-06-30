# Event Registration System

A backend application built using **Node.js**, **Express.js**, and **MySQL** that allows participants to register for events and organizers to manage events.

---

## Features

### Participant
- Register
- Login
- Google OAuth Login
- View all events
- View event details
- Search events
- Filter events by department
- Register for events
- View registered events
- Cancel registrations

### Organizer
- Login
- Create events
- Update events
- Delete events
- View created events
- View participants of an event
- View registration count

### Admin
- Login
- Create organizers
- View organizers
- Update organizers
- Delete organizers

---

## Technologies Used

- Node.js
- Express.js
- MySQL
- JWT Authentication
- Google OAuth 2.0
- Passport.js
- Bcrypt
- Helmet
- CORS
- Express Rate Limit

---

## Database Tables

- users
- events
- registrations

---

## Security Features

- Password Hashing (bcrypt)
- JWT Authentication
- Google OAuth
- Role-Based Access Control
- CORS Protection
- Rate Limiting
- Helmet Security Headers

---

## Installation

1. Clone the repository

git clone <repository-url>

2. Install dependencies

npm install

3. Create a `.env` file and configure:
PORT=

DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

4. Run the application

npm start

---

## API Modules

### Participant APIs
- Event Viewing
- Registration Management

### Organizer APIs
- Event Viewing
- Event Management
- Registration Monitoring

### Admin APIs
- Organizer Management

---

## Author

Developed by **Mohanraj**