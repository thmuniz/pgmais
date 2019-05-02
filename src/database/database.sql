-- MySQL Script generated by MySQL Workbench
-- Wed May  1 20:48:38 2019
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema pgmais
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema pgmais
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `pgmais` DEFAULT CHARACTER SET utf8 ;
USE `pgmais` ;

-- -----------------------------------------------------
-- Table `pgmais`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgmais`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `_id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `data_sent` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pgmais`.`clients`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgmais`.`clients` (
  `_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `CEP` INT(8) NULL,
  `CPF` INT(11) NULL,
  `data_sent` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `district` VARCHAR(255) NULL,
  `street` VARCHAR(255) NULL,
  `state` VARCHAR(255) NULL,
  `users_id` INT(11) NOT NULL,
  PRIMARY KEY (`_id`),
  INDEX `fk_clients_users_idx` (`users_id` ASC) /*VISIBLE*/,
  CONSTRAINT `fk_clients_users`
    FOREIGN KEY (`users_id`)
    REFERENCES `pgmais`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

