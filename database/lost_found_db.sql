-- Creation of database
CREATE DATABASE IF NOT EXISTS lost_found_db;
USE lost_found_db;

-- Lost items table
CREATE TABLE lost_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    itemName VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    lastSeenLocation VARCHAR(255) NOT NULL,
    dateLost DATE NOT NULL,
    contactInfo VARCHAR(255) NOT NULL,
    imageUrl VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- To get all items from lost items table
SELECT * FROM lost_found_db.lost_items;


-- Creation of Found items table
CREATE TABLE Found_Items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    found_location VARCHAR(255) NOT NULL,
    date_found DATE NOT NULL,
    contact_info VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE Found_Items
ADD COLUMN imageUrl VARCHAR(255);

ALTER TABLE Found_Items
ADD COLUMN phone_number VARCHAR(15),
ADD COLUMN address TEXT;

-- To get all items from found items table
SELECT * FROM lost_found_db.found_items;

-- Creation of Users table
CREATE TABLE users (
  full_name VARCHAR(255) NOT NULL,
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  address varchar(255) not null
);

