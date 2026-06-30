CREATE DATABASE eventregdb;

USE eventregdb;

# Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NULL,
    role ENUM('participant','organizer','admin') NOT NULL,
    provider ENUM('local','google') DEFAULT 'local',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  
# Events Table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    department ENUM('CSE','IT','AIDS','EEE','ECE','MECH') NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    venue VARCHAR(150) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    organizer_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id)
);

# Registrations Table
CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT NOT NULL,
    event_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('registered','cancelled') DEFAULT 'registered',
    UNIQUE(participant_id, event_id),
    FOREIGN KEY (participant_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE registration_forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id INT NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    department VARCHAR(50) NOT NULL,
    year_of_study VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (registration_id)
        REFERENCES registrations(id)
        ON DELETE CASCADE
);


select * from registrations;
