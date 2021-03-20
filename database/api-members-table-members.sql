-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: members-api
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nickname` varchar(45) DEFAULT NULL,
  `permissions` int DEFAULT NULL,
  `banishment` bigint DEFAULT NULL,
  `avatar` varchar(200) DEFAULT NULL,
  `password` varchar(250) DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `age` varchar(45) DEFAULT NULL,
  `phone_number` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `date_insert` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (2,'Smaug',1,1,'default.png','$2b$10$b8RCKoLwcdGtdpTn3oIG/ubtTiCncJtUnPy1DZfi3QzKZ1jEun3uO','first name','last name','1','06 00 00 00 00','test@mail.com',1615924296609),(3,'Smaug',1,1,'default.png','$2b$10$BwlOLBgq1b.tmOzl6Sw2qOr1b34.VigAbKN2pmDdcoRQZOlA1caMa','first name','last name','sss','06 00 00 00 00','test@mail.com',1615924339184),(4,'Smaug',1,1,'default.png','$2b$10$j8.UNg/s4Rh9XpysXteeRerCmcuEFtTDw6N6iDw7KAekNUONV5fUO','first name','last name','sss','06 00 00 00 00','test@mail.com',1615924418608),(5,'Smaug',1,1,'default.png','$2b$10$vVzNX36Ml0VVx0U1Fbio5ujPX4xpq0VpPIDTSLucYxXUl2q6ic4nm','first name','last name','sss','06 00 00 00 00','test@mail.com',1615924440104),(6,'Smaug',1,1,'default.png','$2b$10$rJ77Z0SyTKxa4N7aQd4mR.h7ozEMAYdlbuDg4191Yx2QALx823KBq','first name','last name','1','06 00 00 00 00','test@mail.com',1615925128180);
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-03-20 20:48:42
