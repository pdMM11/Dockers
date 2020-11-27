-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: localhost    Database: viral_fusion_protein
-- ------------------------------------------------------
-- Server version	8.0.18

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
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (32,'account','emailaddress'),(33,'account','emailconfirmation'),(1,'admin','logentry'),(30,'allauth','socialaccount'),(29,'allauth','socialapp'),(31,'allauth','socialtoken'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(17,'authtoken','token'),(5,'contenttypes','contenttype'),(18,'crmapp','authgroup'),(19,'crmapp','authgrouppermissions'),(20,'crmapp','authpermission'),(21,'crmapp','authuser'),(22,'crmapp','authusergroups'),(23,'crmapp','authuseruserpermissions'),(24,'crmapp','djangoadminlog'),(25,'crmapp','djangocontenttype'),(26,'crmapp','djangomigrations'),(27,'crmapp','djangosession'),(7,'crmapp','fusionpeptides'),(10,'crmapp','host'),(37,'crmapp','inhibitorantibody'),(14,'crmapp','peptidereferences'),(16,'crmapp','peptidestructure'),(9,'crmapp','protein'),(13,'crmapp','proteinreferences'),(12,'crmapp','references'),(11,'crmapp','structure'),(8,'crmapp','taxhost'),(15,'crmapp','taxonomyvirus'),(39,'endpoints','endpoint'),(40,'endpoints','mlalgorithm'),(41,'endpoints','mlalgorithmstatus'),(38,'endpoints','mlrequest'),(6,'sessions','session'),(28,'sites','site'),(34,'socialaccount','socialaccount'),(35,'socialaccount','socialapp'),(36,'socialaccount','socialtoken');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-15 17:02:53
