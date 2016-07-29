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
   `userfield` FLOAT UNSIGNED NULL DEFAULT NULL,
   `peeraccount` VARCHAR(20) NOT NULL DEFAULT '',
   `linkedid` VARCHAR(32) NOT NULL DEFAULT '',
   `sequence` INT(11) NOT NULL DEFAULT '0',
   `record` VARCHAR(50) NOT NULL DEFAULT '',
   PRIMARY KEY (`id`),
   INDEX `calldate` (`calldate`),
   INDEX `dst` (`dst`),
   INDEX `src` (`src`),
   INDEX `dcontext` (`dcontext`),
   INDEX `clid` (`clid`)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `calls`;
CREATE TABLE `calls` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `calldate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `src` varchar(80) NOT NULL DEFAULT '',
  `dst` varchar(80) NOT NULL DEFAULT '',
  `uniqueid` varchar(32) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `calldate` (`calldate`),
  KEY `dst` (`dst`),
  KEY `src` (`src`)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `report_timeperiods`;
CREATE TABLE `report_timeperiods` (
  `time_id` int(11) NOT NULL,
  `start` time NOT NULL,
  `end` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `report_timeperiods` VALUES (0,'08:30:00','10:00:00'),(1,'10:00:00','12:00:00'),(2,'12:00:00','15:00:00'),(3,'15:00:00','18:00:00'),(4,'18:00:00','21:00:00');
