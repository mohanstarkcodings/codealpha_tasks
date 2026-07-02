# Restaurant Management System (Backend)

A backend application for managing restaurant operations using **Node.js**, **Express.js**, and **MySQL**. The system provides secure authentication, role-based access control, order management, inventory automation, reservation handling, reporting, and Google OAuth integration.

---

# Features

## Authentication & Authorization

- Local Login
- Google OAuth Login
- Role-Based Access Control (RBAC)
- JWT Authentication

---

## User Management

- Create Employee Accounts
- Update User Details
- Delete Users
- View Users
- Filter Users by Role

Supported Roles:

- Admin
- General Manager
- Inventory Manager
- Kitchen Staff
- Waiter
- Customer

---

## Menu Management

### Categories

- Create Category
- Update Category
- Delete Category

### Menu Items

- Add Menu Item
- Update Menu Item
- Delete Menu Item
- View Menu
- Search Menu
- Filter Menu by Category
- Filter Menu by Price Range

---

## Table Management

- Create Restaurant Tables
- Update Table Details
- Delete Tables
- View Table Availability

---

## Reservation Management

- Create Reservation
- Cancel Reservation
- View Customer Reservations
- View All Reservations
- Automatic Table Status Updates

---

## Order Management

- Create Orders
- Update Order Items
- Cancel Order Items
- Update Order Item Status
- View Orders
- View Order Details
- Filter Orders by Table Number
- Generate Bills
- Soft Delete Orders

---

## Kitchen Module

- Kitchen Order Ticket (KOT)
- View Pending Orders
- Update Order Item Status
- Kitchen Workflow Management

---

## Inventory Management

- Inventory Categories
- Inventory Stock Management
- Add Stock
- Update Stock
- Delete Stock
- Filter Inventory by Category

---

## 📊 Reports

### Order Reports

- Total Orders
- Revenue Report
- Most Sold Food
- Top Performing Waiter

### Inventory Reports

- Inventory Categories
- Low Stock Ingredients
- Category with Highest Stock

---

# Special Features

## Soft Delete

Orders are hidden from operational screens without permanently deleting data.

Deleted orders:

- Do not appear in waiter and kitchen screens.
- Continue to be available for reporting.

---

## Recipe Mapping

Each menu item is linked to the inventory ingredients required for preparation.

Example:

Margherita Pizza

- Mozzarella Cheese
- Pizza Sauce
- Maida
- Olive Oil
- Fresh Basil

---

## Automatic Inventory Updates

Inventory is automatically maintained using MySQL Triggers.

### Trigger 1

Pending → Preparing

Automatically deducts ingredients from inventory.

### Trigger 2

Preparing → Cancelled

Ready → Cancelled

Automatically restores deducted inventory.

---

# Database Tables

- users
- categories
- menu_items
- restaurant_tables
- reservations
- orders
- order_items
- inventory_categories
- inventory
- recipe_ingredients

---

# Tech Stack

Backend

- Node.js
- Express.js

Database

- MySQL

Authentication

- JWT
- Google OAuth 2.0
- Express Session

Libraries

- bcrypt
- dotenv
- mysql2

---

# Installation

Clone the repository
git clone <repository-url>

Move into the project
cd Restaurant-Management-System

Install dependencies
npm install

Start the server
npm start

---

# Environment Variables

Create a `.env` file.

PORT=

DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=
SESSION_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

# API Modules

- Authentication
- User Management
- Menu Management
- Table Management
- Reservation Management
- Order Management
- Kitchen Module
- Inventory Module
- Reports

---

# Author

**MohanRaj**
