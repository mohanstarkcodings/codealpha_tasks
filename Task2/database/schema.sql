create database restaurantdb;

use restaurantdb;

#users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL,
    role ENUM(
        'Admin',
        'GeneralManager',
        'Customer',
        'Waiter',
        'KitchenStaff',
        'InventoryManager'
    ) NOT NULL,
    provider ENUM('local','google') DEFAULT 'local',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from  users;

# Categories Table
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

# Menu Items Table
CREATE TABLE menu_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT
);

select * from menu_items;

# Restaurant Tables
CREATE TABLE restaurant_tables (
    table_id INT AUTO_INCREMENT PRIMARY KEY,
    table_number VARCHAR(20) NOT NULL UNIQUE,
    capacity INT NOT NULL,
    status ENUM('Available', 'Occupied', 'Reserved') DEFAULT 'Available'
);

select * from  restaurant_tables;

# Reservations Table
CREATE TABLE reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    table_id INT NOT NULL,
    reservation_time DATETIME NOT NULL,
    guest_count INT NOT NULL,
    status ENUM('Confirmed', 'Cancelled') DEFAULT 'Confirmed',
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (table_id) REFERENCES restaurant_tables(table_id) ON DELETE CASCADE
);

select * from reservations;

# Orders Table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NULL,
    waiter_id INT NOT NULL,
    table_id INT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (waiter_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (table_id) REFERENCES restaurant_tables(table_id) ON DELETE RESTRICT
);

select * from orders;

CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    status ENUM(
        'Pending',
        'Preparing',
        'Ready',
        'Served',
        'Cancelled'
    ) DEFAULT 'Pending',
    note TEXT,
    FOREIGN KEY (order_id)
    REFERENCES orders(order_id)
    ON DELETE CASCADE,
    
    FOREIGN KEY (item_id)
    REFERENCES menu_items(item_id)
    ON DELETE RESTRICT
);

select * from  order_items;

CREATE TABLE inventory_categories (
    inventory_category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

select * from inventory_categories;

# Inventory Table
CREATE TABLE inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    inventory_category_id INT NOT NULL,
    ingredient_name VARCHAR(150) NOT NULL UNIQUE,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    FOREIGN KEY (inventory_category_id)
    REFERENCES inventory_categories(inventory_category_id)
    ON DELETE RESTRICT
);

select * from inventory;

# Recipe Ingredients Table
-- This table enables inventory auto-update.
CREATE TABLE recipe_ingredients (
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    inventory_id INT NOT NULL,
    required_quantity DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id) ON DELETE CASCADE
);

CREATE TABLE recipe_ingredients (
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    inventory_id INT NOT NULL,
    quantity_required DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (item_id)
    REFERENCES menu_items(item_id)
    ON DELETE CASCADE,

    FOREIGN KEY (inventory_id)
    REFERENCES inventory(inventory_id)
    ON DELETE CASCADE
);

-- trigger 1 (To deduct) 
DELIMITER $$

CREATE TRIGGER deduct_inventory_on_preparing
AFTER UPDATE ON order_items
FOR EACH ROW
BEGIN

    IF OLD.status = 'Pending'
       AND NEW.status = 'Preparing'
    THEN

        UPDATE inventory i
        JOIN recipe_ingredients ri
            ON i.inventory_id = ri.inventory_id
        SET i.quantity =
            i.quantity -
            (ri.quantity_required * NEW.quantity)
        WHERE ri.item_id = NEW.item_id;

    END IF;

END$$

DELIMITER ;

-- trigger 2 (To restore)

DELIMITER $$

CREATE TRIGGER restore_inventory_on_cancel
AFTER UPDATE ON order_items
FOR EACH ROW
BEGIN

    IF (
        OLD.status = 'Preparing'
        OR OLD.status = 'Ready'
    )
    AND NEW.status = 'Cancelled'
    THEN

        UPDATE inventory i
        JOIN recipe_ingredients ri
            ON i.inventory_id = ri.inventory_id
        SET i.quantity =
            i.quantity +
            (ri.quantity_required * NEW.quantity)
        WHERE ri.item_id = NEW.item_id;

    END IF;

END$$

DELIMITER ;

-- Step 1: Turn off foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Step 2: Truncate the tables
TRUNCATE TABLE users;
TRUNCATE TABLE events;
TRUNCATE TABLE users;

-- Step 3: Turn foreign key checks back on
SET FOREIGN_KEY_CHECKS = 1;

show tables;