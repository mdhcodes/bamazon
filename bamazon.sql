CREATE DATABASE bamazon_db;

USE `bamazon_db`;

CREATE TABLE `products` (
  `id` INTEGER(10) AUTO_INCREMENT,
  `item_id` VARCHAR(100) NULL,
  `product_name` VARCHAR(100) NULL,
  `department_name` VARCHAR(100) NULL,
  `price` INTEGER(10) NULL
  `stock_quantity` INTEGER(10) NULL
  PRIMARY KEY (id)
);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES('To Kill a Mockingbird',	'Books', 19, 144);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES('The Alchemist',	'Books', 16, 128);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES('The Giver',	'Books', 17, 50);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES('The Four Agreements',	'Books', 27, 98);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES('Walden', 'Books', 9, 92);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES('The Matrix',	'Movies', 8, 20);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES('The Lion in Winter',	'Movies', 5, 0);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES('Love Actually',	'Movies', 13, 34);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES('The Godfather',	'Movies', 13, 40);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES('Imitation of Life',	'Movies', 8, 24);

SELECT * FROM `products`;