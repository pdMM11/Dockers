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
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2020-02-24 13:44:51.758928','10','Host object (10)',2,'[{\"changed\": {\"fields\": [\"Ncbitax\"]}}]',10,2),(2,'2020-02-24 13:45:04.380501','10','Host object (10)',2,'[{\"changed\": {\"fields\": [\"Ncbitax\"]}}]',10,2),(3,'2020-02-26 16:27:04.922787','1','pedro',3,'',4,2),(4,'2020-02-26 16:55:17.364401','10','TaxonomyVirus object (10)',1,'[{\"added\": {}}]',15,2),(5,'2020-02-26 17:03:08.346180','1','FusionPeptides object (1)',1,'[{\"added\": {}}]',7,2),(6,'2020-02-26 17:03:17.371270','1','FusionPeptides object (1)',3,'',7,2),(7,'2020-02-27 18:26:48.281152','1','Superadmin',1,'[{\"added\": {}}]',3,2),(8,'2020-03-11 10:56:43.813594','9315041fd6c18c52bc24b831efca830851f6eee5','9315041fd6c18c52bc24b831efca830851f6eee5',1,'[{\"added\": {}}]',17,2),(9,'2020-03-11 16:18:12.246021','3','PDMM',2,'[{\"changed\": {\"fields\": [\"Staff status\"]}}]',4,2),(10,'2020-03-11 16:36:16.215073','3','PDMM',3,'',4,2),(11,'2020-03-11 16:36:41.506398','4','PDMM',3,'',4,2),(12,'2020-03-11 18:00:53.342993','3','pedrodmmoreira@gmail.com',1,'[{\"added\": {}}]',32,2),(13,'2020-03-31 15:51:07.863623','810','TaxonomyVirus object (810)',1,'[{\"added\": {}}]',15,2),(14,'2020-03-31 15:59:59.860259','31','TaxonomyVirus object (31)',1,'[{\"added\": {}}]',15,2),(15,'2020-04-01 10:23:07.577174','2','pedrodmmoreira@gmail.com',2,'[{\"changed\": {\"fields\": [\"Username\", \"First name\", \"Last name\"]}}]',4,2),(16,'2020-04-01 10:26:38.373282','2','PedroMoreira',2,'[{\"changed\": {\"fields\": [\"Username\"]}}]',4,2),(17,'2020-04-01 10:27:26.802718','2','pedrodmmoreira@gmail.com',2,'[{\"changed\": {\"fields\": [\"Username\"]}}]',4,2),(18,'2020-04-01 10:31:46.104090','2','PedroMoreira',2,'[{\"changed\": {\"fields\": [\"Username\"]}}]',4,2),(19,'2020-04-01 10:49:08.060423','2','1',1,'[{\"added\": {}}]',28,2),(20,'2020-04-01 11:12:02.142917','2','1',3,'',28,2),(21,'2020-05-26 11:34:35.447936','3','FusionPeptides object (3)',1,'[{\"added\": {}}]',7,2);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
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
