CREATE DATABASE IF NOT EXISTS immersia
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_hungarian_ci;

USE immersia;

DROP TABLE IF EXISTS `sounds`;
CREATE TABLE `sounds` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(100) NOT NULL,
  `title` varchar(100) NOT NULL,
  `duration_seconds` int(11) DEFAULT NULL,
  `sound_file_path` varchar(500) NOT NULL,
  `sound_file_format` enum('ogg','mp3','wav') NOT NULL,
  `image_file_path` varchar(500) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `type` enum('oneshot','ambience','scene') NOT NULL,
  KEY `idx_sounds_type` (`type`),
  FULLTEXT KEY `ft_sounds_title` (`title`),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
);

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `email` varbinary(255) NOT NULL,
  `email_blind_index` char(64) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` tinyint(4) DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `token_version` bigint(20) DEFAULT 1,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_blind_index` (`email_blind_index`) USING BTREE
);

DROP TABLE IF EXISTS `email_codes`;
CREATE TABLE `email_codes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `token_hash` varchar(255) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `type` enum('confirm','password_reset') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `email_codes_users_FK` (`user_id`),
  CONSTRAINT `email_codes_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS `favourites`;
CREATE TABLE `favourites` (
  `user_id` bigint(20) unsigned NOT NULL,
  `sound_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`, `sound_id`),
  KEY `favourites_user_FK` (`user_id`),
  CONSTRAINT `favourites_user_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `favourites_sound_FK` (`sound_id`),
  CONSTRAINT `favourites_sound_FK` FOREIGN KEY (`sound_id`) REFERENCES `sounds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);