use restaurantdb;

insert into users(full_name,email,password_hash,role,provider) 
values ('customer1','customer1@gmail.com','$2b$10$5QX0ITa0r/MjDjKEcjgk0uBR0Z2BWh.T1FRQ0Q5wLr7cHmSGyg7G6','Customer','local');
insert into users(full_name,email,password_hash,role,provider) 
values ('customer2','customer2@gmail.com','$2b$10$5QX0ITa0r/MjDjKEcjgk0uBR0Z2BWh.T1FRQ0Q5wLr7cHmSGyg7G6','Customer','google');

insert into users(full_name,email,password_hash,role,provider) 
values ('waiter1','waiter1@gmail.com','$2b$10$5QX0ITa0r/MjDjKEcjgk0uBR0Z2BWh.T1FRQ0Q5wLr7cHmSGyg7G6','Waiter','local');
insert into users(full_name,email,password_hash,role,provider) 
values ('waiter2','waiter2@gmail.com','$2b$10$5QX0ITa0r/MjDjKEcjgk0uBR0Z2BWh.T1FRQ0Q5wLr7cHmSGyg7G6','Waiter','local');

insert into users(full_name,email,password_hash,role,provider) 
values ('kitchenstaff1','kitchen1@gmail.com','$2b$10$5QX0ITa0r/MjDjKEcjgk0uBR0Z2BWh.T1FRQ0Q5wLr7cHmSGyg7G6','KitchenStaff','local');
insert into users(full_name,email,password_hash,role,provider) 
values ('kitchenstaff2','kitchen2@gmail.com','$2b$10$5QX0ITa0r/MjDjKEcjgk0uBR0Z2BWh.T1FRQ0Q5wLr7cHmSGyg7G6','KitchenStaff','local');

insert into users(full_name,email,password_hash,role,provider) 
values ('inventorymanager1','inventorymanager1@gmail.com','$2b$10$5QX0ITa0r/MjDjKEcjgk0uBR0Z2BWh.T1FRQ0Q5wLr7cHmSGyg7G6','InventoryManager','local');
insert into users(full_name,email,password_hash,role,provider) 
values ('inventorymanager2','inventorymanager2@gmail.com','$2b$10$5QX0ITa0r/MjDjKEcjgk0uBR0Z2BWh.T1FRQ0Q5wLr7cHmSGyg7G6','InventoryManager','local');

insert into users(full_name,email,password_hash,role,provider) 
values ('generalmanager1','generalmanager1@gmail.com','$2b$10$5QX0ITa0r/MjDjKEcjgk0uBR0Z2BWh.T1FRQ0Q5wLr7cHmSGyg7G6','GeneralManager','local');
insert into users(full_name,email,password_hash,role,provider) 
values ('generalmanager2','generalmanager2@gmail.com','$2b$10$5QX0ITa0r/MjDjKEcjgk0uBR0Z2BWh.T1FRQ0Q5wLr7cHmSGyg7G6','GeneralManager','local');

insert into users(full_name,email,password_hash,role,provider) 
values ('admin','admin@gmail.com','$2b$10$KKZm3mgo85a4qxOKXXG4OORDu12FGrK5cMQgIwBxQLoumI2mSVEkK','Admin','local');

INSERT INTO categories (category_name)
VALUES
('Starters'),
('Main Course'),
('North Indian Foods'),
('South Indian Foods'),
('Non Veg Foods'),
('Veg Foods'),
('Drinks'),
('Waffles'),
('Ice Cream & Frozen Desserts'),
('Soup'),
('Salad'),
('Beverages'),
('Desserts'),
('Pizza');

INSERT INTO menu_items
(category_id, name, description, price, is_available)
VALUES

-- Starters (1)
(1,'Garlic Bread','Crispy garlic flavored bread',120,TRUE),
(1,'Chicken Wings','Spicy chicken wings',220,TRUE),
(1,'Mozzarella Sticks','Fried mozzarella cheese sticks',180,TRUE),
(1,'Bruschetta','Toasted bread with tomato topping',150,TRUE),
(1,'Spring Rolls','Vegetable spring rolls',140,TRUE),

-- Main Course (2)
(2,'Grilled Chicken Breast','Tender grilled chicken breast',350,TRUE),
(2,'Ribeye Steak','Juicy ribeye steak',650,TRUE),
(2,'Beef Burger','Classic beef burger',280,TRUE),
(2,'BBQ Pork Ribs','Slow-cooked BBQ pork ribs',520,TRUE),
(2,'Chicken Alfredo','Creamy chicken alfredo pasta',340,TRUE),
(2,'Grilled Salmon','Fresh grilled salmon fillet',580,TRUE),
(2,'Fish and Chips','Fried fish with chips',320,TRUE),
(2,'Garlic Butter Prawns','Prawns cooked in garlic butter',450,TRUE),

-- North Indian Foods (3)
(3,'Dal Makhani','Creamy black lentils',220,TRUE),
(3,'Kadhai Paneer','Paneer cooked with spices',260,TRUE),
(3,'Chole Bhature','Chickpea curry with bhature',200,TRUE),
(3,'Aloo Amritsari Kulcha','Stuffed kulcha with potato filling',180,TRUE),
(3,'Palak Paneer','Paneer in spinach gravy',250,TRUE),
(3,'Butter Naan','Soft butter naan',50,TRUE),
(3,'Garlic Naan','Garlic flavored naan',60,TRUE),
(3,'Jeera Rice','Rice flavored with cumin',120,TRUE),

-- South Indian Foods (4)
(4,'Classic Ghee Roast Dosa','Crispy ghee roast dosa',130,TRUE),
(4,'Idli with Sambar & Chutney','Soft idlis served with sambar',90,TRUE),
(4,'Medu Vada','Crispy lentil doughnuts',80,TRUE),
(4,'Onion Uttapam','Uttapam topped with onions',120,TRUE),
(4,'Appam with Vegetable Stew','Appam served with stew',180,TRUE),
(4,'Malabar Parotta with Veg Kurma','Parotta with kurma',170,TRUE),
(4,'Curd Rice','Rice mixed with curd',110,TRUE),
(4,'Gunpowder Podi Dosa','Dosa with spicy podi',140,TRUE),

-- Non Veg Foods (5)
(5,'Butter Chicken (Murgh Makhani)','Creamy butter chicken curry',320,TRUE),
(5,'Chicken Tikka Masala','Grilled chicken in masala gravy',300,TRUE),
(5,'Mutton Biryani (With raita)','Traditional mutton biryani',350,TRUE),
(5,'Chicken Chettinad','Spicy Chettinad chicken curry',290,TRUE),
(5,'Crispy Fish Fingers','Breaded fish finger snacks',260,TRUE),
(5,'Mutton Rogan Josh','Kashmiri style mutton curry',380,TRUE),
(5,'Garlic Butter Chili Chicken','Chicken tossed in garlic butter sauce',280,TRUE),
(5,'Prawn Thokku','South Indian prawn masala',340,TRUE),

-- Veg Foods (6)
(6,'Veggie Burger','Vegetable patty burger',220,TRUE),
(6,'Mushroom Risotto','Creamy mushroom risotto',280,TRUE),
(6,'Paneer Tikka Masala','Paneer tikka gravy',270,TRUE),
(6,'Veg Hakka Noodles','Indo-Chinese noodles',200,TRUE),
(6,'Crispy Chilli Corn','Fried spicy corn',180,TRUE),
(6,'Vegetable Jalfrezi','Mixed vegetable curry',230,TRUE),
(6,'Soya Chaap Masala','Soya chaap curry',260,TRUE),
(6,'Thai Green Curry (Veg)','Vegetarian Thai curry',320,TRUE),

-- Drinks (7)
(7,'Fresh Orange Juice','Freshly squeezed orange juice',120,TRUE),
(7,'Fresh Watermelon Juice','Fresh watermelon juice',110,TRUE),
(7,'Mango Lassi','Traditional mango yogurt drink',130,TRUE),
(7,'Classic Lemon Iced Tea','Refreshing iced tea',100,TRUE),
(7,'Mint Mojito Mocktail','Mint flavored mocktail',140,TRUE),
(7,'Blue Lagoon Mocktail','Blue citrus mocktail',150,TRUE),

-- Waffles (8)
(8,'Classic Belgian Waffle','Traditional Belgian waffle',180,TRUE),
(8,'Nutella & Banana Waffle','Waffle topped with Nutella and banana',240,TRUE),
(8,'Mixed Berry Bliss','Berry topped waffle',260,TRUE),
(8,'Cookies & Cream Waffle','Cookies and cream flavored waffle',250,TRUE),
(8,'Caramel Pecan Crunch','Caramel and pecan waffle',270,TRUE),
(8,'Savory Chicken & Waffles','Chicken served with waffle',320,TRUE),
(8,'Churro Waffle','Cinnamon sugar waffle',230,TRUE),
(8,'Dark Chocolate Decadence','Chocolate loaded waffle',280,TRUE),

-- Ice Cream & Frozen Desserts (9)
(9,'Classic Vanilla Bean','Vanilla ice cream',90,TRUE),
(9,'Double Chocolate Fudge','Chocolate fudge ice cream',110,TRUE),
(9,'Strawberry Fields','Strawberry ice cream',100,TRUE),
(9,'Mint Chocolate Chip','Mint chocolate chip ice cream',120,TRUE),
(9,'Salted Caramel Crunch','Salted caramel ice cream',130,TRUE),
(9,'Cookies and Cream','Cookies and cream ice cream',120,TRUE),
(9,'Mango Sorbet','Mango flavored sorbet',100,TRUE),
(9,'Banana Split Sundae','Banana split dessert',180,TRUE),

-- Soup (10)
(10,'Tomato Basil Soup','Classic tomato basil soup',120,TRUE),
(10,'Cream of Mushroom','Creamy mushroom soup',140,TRUE),
(10,'Chicken Noodle Soup','Chicken noodle soup',160,TRUE),
(10,'Sweet Corn Soup','Sweet corn soup',110,TRUE),
(10,'Hot and Sour Vegetable Soup','Spicy vegetable soup',130,TRUE),
(10,'Clear Lemon Coriander Soup','Light coriander soup',120,TRUE),
(10,'Minestrone Soup','Italian vegetable soup',150,TRUE),
(10,'French Onion Soup','Caramelized onion soup',160,TRUE),

-- Salad (11)
(11,'Caesar Salad','Classic Caesar salad',180,TRUE),
(11,'Greek Salad','Mediterranean salad',190,TRUE),
(11,'Garden Salad','Fresh garden vegetables',150,TRUE),
(11,'Caprese Salad','Tomato mozzarella salad',220,TRUE),
(11,'Quinoa Avocado Salad','Healthy quinoa salad',260,TRUE),
(11,'Roasted Beetroot & Goat Cheese Salad','Beetroot salad',280,TRUE),
(11,'Crunchy Asian Coleslaw','Asian style coleslaw',170,TRUE),
(11,'Watermelon Feta Mint Salad','Watermelon feta salad',210,TRUE),

-- Beverages (12)
(12,'Iced Latte','Cold coffee latte',140,TRUE),
(12,'Coca-Cola','Soft drink',60,TRUE),
(12,'Mineral Water','Packaged drinking water',30,TRUE),
(12,'Lemon Mint Cooler','Refreshing cooler',100,TRUE),
(12,'Hot Espresso Shot','Strong espresso',90,TRUE),
(12,'Classic Cappuccino','Coffee cappuccino',120,TRUE),
(12,'Hot Chocolate with Marshmallows','Chocolate drink',160,TRUE),
(12,'Oreo Milkshake','Oreo flavored milkshake',180,TRUE),

-- Desserts (13)
(13,'Chocolate Brownie','Chocolate brownie dessert',140,TRUE),
(13,'Cheesecake','Creamy cheesecake',180,TRUE),
(13,'Apple Pie','Traditional apple pie',170,TRUE),
(13,'Ice Cream Sundae','Ice cream sundae',160,TRUE),
(13,'Tiramisu','Italian coffee dessert',220,TRUE),
(13,'Warm Molten Lava Cake','Chocolate lava cake',240,TRUE),
(13,'Gulab Jamun with Rabri','Indian dessert',160,TRUE),
(13,'Creme Brulee','French custard dessert',250,TRUE),

-- Pizza (14)
(14,'Margherita Pizza','Classic cheese pizza',280,TRUE),
(14,'Classic Pepperoni','Pepperoni pizza',340,TRUE),
(14,'BBQ Chicken Pizza','BBQ chicken topped pizza',360,TRUE),
(14,'Four Cheese (Quattro Formaggi)','Four cheese pizza',380,TRUE),
(14,'Hawaiian (Ham and pineapple)','Ham and pineapple pizza',350,TRUE),
(14,'Veggie Supreme','Loaded vegetable pizza',320,TRUE),
(14,'Meat Lovers','Loaded meat pizza',420,TRUE),
(14,'Prosciutto & Arugula','Italian style pizza',450,TRUE);

INSERT INTO restaurant_tables
(table_number, capacity, status)
VALUES
('T1', 2, 'Available'),
('T2', 2, 'Available'),
('T3', 2, 'Available'),
('T4', 2, 'Available'),

('T5', 4, 'Available'),
('T6', 4, 'Available'),
('T7', 4, 'Available'),
('T8', 4, 'Available'),
('T9', 4, 'Available'),
('T10', 4, 'Available'),

('T11', 6, 'Available'),
('T12', 6, 'Available'),
('T13', 6, 'Available'),
('T14', 6, 'Available'),

('T15', 8, 'Available'),
('T16', 8, 'Available'),
('T17', 8, 'Available'),

('T18', 10, 'Available'),
('T19', 10, 'Available'),

('T20', 12, 'Available');

INSERT INTO reservations
(customer_id, table_id, reservation_time, guest_count, status)
VALUES

(1, 5,  '2026-06-20 19:00:00', 4, 'Confirmed'),
(2, 11, '2026-06-20 20:00:00', 6, 'Confirmed'),

(1, 2,  '2026-06-21 12:30:00', 2, 'Confirmed'),
(2, 15, '2026-06-21 19:30:00', 8, 'Confirmed'),

(1, 6,  '2026-06-22 13:00:00', 4, 'Cancelled'),
(2, 3,  '2026-06-22 18:00:00', 2, 'Confirmed'),

(1, 12, '2026-06-23 20:00:00', 6, 'Confirmed'),
(2, 18, '2026-06-23 21:00:00', 10, 'Cancelled'),

(1, 7,  '2026-06-24 19:15:00', 4, 'Confirmed'),
(2, 1,  '2026-06-24 12:00:00', 2, 'Confirmed'),

(1, 16, '2026-06-25 20:30:00', 8, 'Confirmed'),
(2, 13, '2026-06-25 18:45:00', 6, 'Confirmed'),

(1, 4,  '2026-06-26 13:30:00', 2, 'Cancelled'),
(2, 9,  '2026-06-26 19:00:00', 4, 'Confirmed'),

(1, 20, '2026-06-27 21:00:00', 12, 'Confirmed'),
(2, 14, '2026-06-27 20:00:00', 6, 'Confirmed');

INSERT INTO orders
(customer_id, waiter_id, table_id)
VALUES

(1, 3, 5),
(2, 3, 11),

(1, 3, 2),
(2, 3, 15),

(1, 3, 6),
(2, 3, 3),

(1, 3, 12),
(2, 3, 18),

(1, 3, 7),
(2, 3, 1),

(1, 3, 16),
(2, 3, 13),

(1, 3, 4),
(2, 3, 9),

(1, 3, 20),
(2, 3, 14);

INSERT INTO order_items
(order_id, item_id, quantity, note,status)
VALUES

-- Order 1
(1, 97, 2, 'Extra cheese','Preparing'),
(1, 43, 2, 'Less ice','Preparing'),

-- Order 2
(2, 29, 1, 'Medium spicy','Preparing'),
(2, 30, 1, NULL,'Preparing'),
(2, 44, 2, NULL,'Preparing'),

-- Order 3
(3, 21, 3, NULL,'Preparing'),
(3, 22, 2, 'Extra sambar','Preparing'),

-- Order 4
(4, 7, 1, NULL,'Preparing'),
(4, 8, 2, NULL,'Preparing'),
(4, 82, 1, NULL,'Preparing'),

-- Order 5
(5, 35, 1, 'Extra crispy','Preparing'),
(5, 37, 1, NULL,'Preparing'),

-- Order 6
(6, 97, 1, NULL,'Preparing'),
(6, 98, 1, NULL,'Preparing'),
(6, 99, 1, NULL,'Preparing'),

-- Order 7
(7, 51, 2, NULL,'Preparing'),
(7, 54, 1, 'Extra berries','Preparing'),

-- Order 8
(8, 63, 2, NULL,'Preparing'),
(8, 66, 1, NULL,'Preparing'),

-- Order 9
(9, 89, 1, NULL,'Preparing'),
(9, 92, 2, NULL,'Preparing');

INSERT INTO inventory_categories (category_name)
VALUES
('Meats and Seafood'),
('Dairy, Paneer and Eggs'),
('Vegetables and Fresh Produce'),
('Fruits'),
('Grains, Flours and Grains'),
('Baking and Sweets'),
('Ice Creams and Frozen Bases'),
('Liquids, Syrups and Beverages'),
('Pantry Essentials');

INSERT INTO inventory
(
    inventory_category_id,
    ingredient_name,
    quantity,
    unit
)
VALUES
-- Meats & Seafood (1)
(1,'Chicken Breast',50.00,'kg'),
(1,'Chicken Wings',30.00,'kg'),
(1,'Ribeye Steak',40.00,'kg'),
(1,'Beef Patties',200.00,'pieces'),
(1,'Pork Ribs',35.00,'kg'),
(1,'Mutton / Lamb Meat',45.00,'kg'),
(1,'Salmon Fillets',25.00,'kg'),
(1,'White Fish Fillets',30.00,'kg'),
(1,'Prawns',25.00,'kg'),
(1,'Pepperoni Slices',15.00,'kg'),
(1,'Bacon Strips',20.00,'kg'),
(1,'Prosciutto',10.00,'kg'),

-- Dairy, Paneer & Eggs (2)
(2,'Mozzarella Cheese',60.00,'kg'),
(2,'Cheddar Cheese',25.00,'kg'),
(2,'Paneer (Cottage Cheese)',40.00,'kg'),
(2,'Soya Chaap sticks',20.00,'kg'),
(2,'Butter',50.00,'kg'),
(2,'Ghee (Clarified Butter)',30.00,'kg'),
(2,'Heavy Cream',40.00,'litres'),
(2,'Milk',100.00,'litres'),
(2,'Yogurt / Curd',50.00,'kg'),
(2,'Eggs',500.00,'pieces'),
(2,'Mascarpone Cheese',15.00,'kg'),
(2,'Goat Cheese',10.00,'kg'),
(2,'Feta Cheese',15.00,'kg'),

-- Vegetables & Fresh Produce (3)
(3,'Tomatoes',80.00,'kg'),
(3,'Onions',100.00,'kg'),
(3,'Garlic',20.00,'kg'),
(3,'Ginger',15.00,'kg'),
(3,'Potatoes',90.00,'kg'),
(3,'Button Mushrooms',25.00,'kg'),
(3,'Bell Peppers (Mixed)',40.00,'kg'),
(3,'Black Olives',10.00,'kg'),
(3,'Fresh Basil Leaves',5.00,'kg'),
(3,'Romaine Lettuce',30.00,'kg'),
(3,'Cucumber',25.00,'kg'),
(3,'Avocado',15.00,'kg'),
(3,'Beetroot',20.00,'kg'),
(3,'Cabbage & Carrots Mix',30.00,'kg'),
(3,'Sweet Corn Cobs',25.00,'kg'),
(3,'Lemon / Limes',300.00,'pieces'),
(3,'Fresh Mint Leaves',10.00,'kg'),
(3,'Arugula Leaves',8.00,'kg'),
(3,'Spinach (Palak)',20.00,'kg'),

-- Fruits (4)
(4,'Fresh Oranges',150.00,'kg'),
(4,'Fresh Watermelons',100.00,'kg'),
(4,'Fresh Mangoes / Pulp',50.00,'kg'),
(4,'Bananas',100.00,'pieces'),
(4,'Mixed Berries (Frozen)',20.00,'kg'),
(4,'Apples',30.00,'kg'),

-- Grains, Flours & Grains (5)
(5,'Basmati Rice',120.00,'kg'),
(5,'Dosa/Idli Rice Batter',150.00,'kg'),
(5,'Black Lentils (Urad Dal)',40.00,'kg'),
(5,'Chickpeas (Chole)',30.00,'kg'),
(5,'Maida (All-Purpose Flour)',100.00,'kg'),
(5,'Atta (Wheat Flour)',80.00,'kg'),
(5,'Risotto Rice (Arborio)',20.00,'kg'),
(5,'Hakka Noodles (Dry)',25.00,'kg'),
(5,'Quinoa Seeds',15.00,'kg'),
(5,'Pasta (Fettuccine/Penna)',35.00,'kg'),

-- Baking & Sweets (6)
(6,'Waffle Mix',40.00,'kg'),
(6,'Nutella Spread',15.00,'kg'),
(6,'Oreo Cookies',50.00,'packets'),
(6,'Chocolate Chips & Cocoa',25.00,'kg'),
(6,'Sugar',80.00,'kg'),
(6,'Gulab Jamun Mix',15.00,'kg'),

-- Ice Creams & Frozen Bases (7)
(7,'Vanilla Ice Cream Base',50.00,'litres'),
(7,'Chocolate Ice Cream Base',40.00,'litres'),
(7,'Strawberry Ice Cream Base',30.00,'litres'),
(7,'Mint Ice Cream Base',20.00,'litres'),
(7,'Caramel Ice Cream Base',20.00,'litres'),
(7,'Mango Sorbet Base',20.00,'litres'),

-- Liquids, Syrups & Beverages (8)
(8,'Coffee Beans (Espresso)',25.00,'kg'),
(8,'Blue Curacao Syrup',10.00,'bottles'),
(8,'Maple Syrup',15.00,'bottles'),
(8,'Caramel Sauce',12.00,'bottles'),
(8,'Pizza Sauce Base',50.00,'litres'),
(8,'BBQ Sauce',20.00,'litres'),
(8,'Thai Green Curry Paste',15.00,'kg'),
(8,'Spring Roll Wrappers',500.00,'pieces'),
(8,'Coca-Cola Cans',300.00,'pieces'),
(8,'Diet Coke Cans',200.00,'pieces'),
(8,'Mineral Water Bottles',500.00,'pieces'),

-- Pantry Essentials (9)
(9,'Vegetable Oil',100.00,'litres'),
(9,'Olive Oil',40.00,'litres'),
(9,'Mayonnaise & Caesar Dressing',30.00,'kg'),
(9,'Gunpowder Podi Mix',10.00,'kg');


INSERT INTO recipe_ingredients
(item_id, inventory_id, quantity_required)
VALUES

-- Spring Rolls (item_id = 5)
(5, 80, 2.00),   -- Spring Roll Wrappers
(5, 39, 0.10),   -- Cabbage & Carrot Mix
(5, 84, 0.05),   -- Vegetable Oil

-- Chicken Alfredo (item_id = 10)
(10, 1, 0.25),   -- Chicken Breast
(10, 60, 0.20),  -- Pasta
(10, 19, 0.10),  -- Heavy Cream
(10, 17, 0.05),  -- Butter
(10, 28, 0.02),  -- Garlic

-- Butter Chicken (item_id = 30)
(30, 1, 0.30),   -- Chicken Breast
(30, 17, 0.05),  -- Butter
(30, 19, 0.08),  -- Heavy Cream
(30, 26, 0.15),  -- Tomatoes
(30, 27, 0.10),  -- Onions

-- Veggie Burger (item_id = 38)
(38, 4, 1.00),   -- Beef Patty
(38, 26, 0.05),  -- Tomatoes
(38, 27, 0.05),  -- Onions
(38, 14, 0.05),  -- Cheddar Cheese
(38, 86, 0.03),  -- Mayonnaise

-- Mushroom Risotto (item_id = 39)
(39, 57, 0.25),  -- Risotto Rice
(39, 31, 0.15),  -- Button Mushrooms
(39, 17, 0.05),  -- Butter
(39, 19, 0.10),  -- Heavy Cream

-- Mango Lassi (item_id = 48)
(48, 47, 0.20),  -- Mango Pulp
(48, 21, 0.15),  -- Yogurt
(48, 65, 0.03),  -- Sugar

-- Caesar Salad (item_id = 76)
(76, 35, 0.20),  -- Romaine Lettuce
(76, 86, 0.05),  -- Caesar Dressing
(76, 14, 0.03),  -- Cheddar Cheese

-- Classic Cappuccino (item_id = 89)
(89, 73, 0.02),  -- Coffee Beans
(89, 20, 0.20),  -- Milk
(89, 65, 0.01),  -- Sugar

-- Margherita Pizza (item_id = 100)
(100, 13, 0.20), -- Mozzarella Cheese
(100, 77, 0.10), -- Pizza Sauce
(100, 55, 0.30), -- Maida
(100, 85, 0.02), -- Olive Oil
(100, 34, 0.01), -- Fresh Basil

-- BBQ Chicken Pizza (item_id = 102)
(102, 1, 0.20),  -- Chicken Breast
(102, 13, 0.20), -- Mozzarella Cheese
(102, 77, 0.10), -- Pizza Sauce
(102, 78, 0.05), -- BBQ Sauce
(102, 55, 0.30); -- Maida
