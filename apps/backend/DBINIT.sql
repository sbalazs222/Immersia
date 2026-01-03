START TRANSACTION;

CREATE DATABASE IF NOT EXISTS immersia
CHARACTER SET utf8mb4
COLLATE utf8mb4_hungarian_ci;

USE immersia;

CREATE TABLE users(
	id bigint PRIMARY KEY AUTO_INCREMENT UNIQUE,
	email varchar(255) NOT NULL,
	password varchar(255)
);


COMMIT;