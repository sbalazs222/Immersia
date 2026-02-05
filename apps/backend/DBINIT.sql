START TRANSACTION;

CREATE DATABASE IF NOT EXISTS immersia
CHARACTER SET utf8mb4
COLLATE utf8mb4_hungarian_ci;

USE immersia;

CREATE TABLE users(
	id bigint PRIMARY KEY AUTO_INCREMENT UNIQUE,
	email varchar(255) NOT NULL,
	password varchar(255),
	role tinyint DEFAULT 0
);

CREATE TABLE sounds(
id BIGINT PRIMARY KEY AUTO_INCREMENT,

slug VARCHAR(100) NOT NULL UNIQUE,
title VARCHAR(100) NOT NULL,

duration_seconds INT,
loopable BOOLEAN NOT NULL DEFAULT TRUE,

sound_file_path VARCHAR(500) NOT NULL,
sound_file_format ENUM('ogg', 'mp3', 'wav') NOT NULL,
image_file_path VARCHAR(500) NOT NULL,
image_file_format ENUM('png', 'jpg') NOT NULL,

created_at TIMESTAMP DEFAULT current_timestamp(),
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()


);


COMMIT;