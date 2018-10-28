DROP DATABASE IF EXISTS bamazon;

-- Create a MySQL Database called bamazon
CREATE database bamazon;

USE bamazon;

-- Then create a Table inside of that database called products
CREATE TABLE products (
    -- item_id (unique id for each product)
    item_id INT NOT NULL AUTO_INCREMENT
    -- product_name (Name of product)
    , product_name VARCHAR(100) NULL
    -- department_name
    , department_name VARCHAR(100) NULL
    -- price (cost to customer)
    , price DECIMAL(10,2) NULL
    -- stock_quantity (how much of the product is available in stores)
    , stock_quantity INT NULL
    , PRIMARY KEY (item_id)
);

-- Insert 10 "mock" data rows into this database and table
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ('49108005', 'Paw Patrol Toddler Helmet - Age 3+', 'Sports & Outdoors', '16.65', '150');

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ('53838765', "Women's Tie Back Pullover Sweater", "Women's Clothing", '27.99', '121');

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ('53618113', "Women's Tech Fleece Mid-Rise Pants", "Women's Clothing", '20.95', '35');

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ('52030670', 'Contigo Autoseal West Loop Stainless Steel Travel Mug 16oz', 'Kitchen & Dining', '17.99', '436');

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ('53551907', 'PAW Patrol Ultimate Rescue Ultimate Helicopter - Skye', 'Toys', '33.99', '39');

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ('21496284', 'Rachael Ray Stoneware 3.5qt Rectangular Dish - Red', 'Kitchen & Dining', '42.49', '34');

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ('10821252', 'Gaiam® No Slip Black/Gray Yoga Socks (S/M)', 'Sports & Outdoors', '9.99', '58');

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ('50801697', 'Gaiam Printed Yoga Mats (4mm)', 'Sports & Outdoors', '16.99', '45');

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ('52929437', 'New View 12''x12'' Black Letter Board with Gray Trim', 'Home Decor', '12.99', '1085');

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ('53216197', 'DIY Lightbox Novelty LED Table Lamp Black', 'Home Decor', '18.99', '329');

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ('53975412', 'Diamond Knit Chenille Oversized Square Throw Pillow', 'Home Decor', '23.99', '357');

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ('53338905', 'Cool Maker KumiKreator Friendship Bracelet Maker Activity Kit', 'Toys', '24.99', '124');

SELECT * from products;