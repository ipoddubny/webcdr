DROP TABLE IF EXISTS `webuser`;
CREATE TABLE `webuser` (
   `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
   `name` VARCHAR(100) NOT NULL DEFAULT '',
   `username` VARCHAR(100) NOT NULL UNIQUE,
   `password` VARCHAR(100) NOT NULL,
   `acl` VARCHAR(1024) NOT NULL DEFAULT '',
   `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   `admin` INT(1) NOT NULL DEFAULT 0,
   `acl_in` INT(1) NOT NULL DEFAULT 0,
   `auth_ad` INT(1) NOT NULL DEFAULT 0,
   PRIMARY KEY (`id`)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `webuser` (`name`,`username`,`password`,`admin`) VALUES ('Administrator','admin','admincdr',1);

DROP TABLE IF EXISTS `cdr`;
CREATE TABLE `cdr` (
   `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
   `calldate` DATETIME NOT NULL,
   `clid` VARCHAR(80) NOT NULL DEFAULT '',
   `src` VARCHAR(80) NOT NULL DEFAULT '',
   `dst` VARCHAR(80) NOT NULL DEFAULT '',
   `dcontext` VARCHAR(80) NOT NULL DEFAULT '',
   `channel` VARCHAR(80) NOT NULL DEFAULT '',
   `dstchannel` VARCHAR(50) NOT NULL DEFAULT '',
   `lastapp` VARCHAR(80) NOT NULL DEFAULT '',
   `lastdata` VARCHAR(200) NOT NULL DEFAULT '',
   `duration` INTEGER(11) NOT NULL DEFAULT '0',
   `billsec` INTEGER(11) NOT NULL DEFAULT '0',
   `disposition` VARCHAR(45) NOT NULL DEFAULT '',
   `amaflags` VARCHAR(50) NULL DEFAULT NULL,
   `accountcode` VARCHAR(20) NULL DEFAULT NULL,
   `uniqueid` VARCHAR(32) NOT NULL DEFAULT '',
   `userfield` VARCHAR(32) NULL DEFAULT NULL,
   `peeraccount` VARCHAR(20) NOT NULL DEFAULT '',
   `linkedid` VARCHAR(32) NOT NULL DEFAULT '',
   `sequence` INT(11) NOT NULL DEFAULT '0',
   `record` VARCHAR(50) NOT NULL DEFAULT '',
   PRIMARY KEY (`id`),
   INDEX `calldate` (`calldate`),
   INDEX `dst` (`dst`),
   INDEX `src` (`src`),
   INDEX `clid` (`clid`)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;
