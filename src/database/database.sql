create database pgmais;
use pgmais;

CREATE TABLE IF NOT EXISTS `pgmais`.`users` (
  `_id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `data_sent` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`_id`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `pgmais`.`clients` (
  `_id` INT NOT NULL,
  `name` VARCHAR(255) NULL,
  `CEP` INT(8) NULL,
  `CPF` INT(11) NULL,
  `date_sent` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `district` VARCHAR(255) NULL,
  `street` VARCHAR(255) NULL,
  `state` VARCHAR(255) NULL,
  `users__id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`_id`, `users__id`),
  INDEX `fk_clients_users_idx` (`users__id` ASC) VISIBLE,
  CONSTRAINT `fk_clients_users`
    FOREIGN KEY (`users__id`)
    REFERENCES `pgmais`.`users` (`_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
