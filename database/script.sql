-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema projektni_sni
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema projektni_sni
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `projektni_sni` DEFAULT CHARACTER SET utf8 ;
USE `projektni_sni` ;

-- -----------------------------------------------------
-- Table `projektni_sni`.`USER`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `projektni_sni`.`USER` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `username` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `role` TINYINT(4) NOT NULL,
  `certificate` LONGBLOB NOT NULL,
  `private_key` LONGBLOB NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
