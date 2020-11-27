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
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2019-09-14 02:45:45.022584'),(2,'auth','0001_initial','2019-09-14 02:45:45.373606'),(3,'admin','0001_initial','2019-09-14 02:45:46.547488'),(4,'admin','0002_logentry_remove_auto_add','2019-09-14 02:45:46.754790'),(5,'admin','0003_logentry_add_action_flag_choices','2019-09-14 02:45:46.771788'),(6,'contenttypes','0002_remove_content_type_name','2019-09-14 02:45:46.938086'),(7,'auth','0002_alter_permission_name_max_length','2019-09-14 02:45:47.046227'),(8,'auth','0003_alter_user_email_max_length','2019-09-14 02:45:47.108854'),(9,'auth','0004_alter_user_username_opts','2019-09-14 02:45:47.131361'),(10,'auth','0005_alter_user_last_login_null','2019-09-14 02:45:47.287918'),(11,'auth','0006_require_contenttypes_0002','2019-09-14 02:45:47.300137'),(12,'auth','0007_alter_validators_add_error_messages','2019-09-14 02:45:47.330662'),(13,'auth','0008_alter_user_username_max_length','2019-09-14 02:45:47.531844'),(14,'auth','0009_alter_user_last_name_max_length','2019-09-14 02:45:47.721012'),(15,'auth','0010_alter_group_name_max_length','2019-09-14 02:45:47.796585'),(16,'auth','0011_update_proxy_permissions','2019-09-14 02:45:47.829902'),(17,'sessions','0001_initial','2019-09-14 02:45:47.903038'),(18,'authtoken','0001_initial','2020-03-11 10:55:30.140151'),(19,'authtoken','0002_auto_20160226_1747','2020-03-11 10:55:30.706195'),(20,'crmapp','0001_initial','2020-03-11 11:31:27.781333'),(21,'account','0001_initial','2020-03-11 12:31:03.970812'),(22,'account','0002_email_max_length','2020-03-11 12:31:04.549853'),(23,'sites','0001_initial','2020-03-11 12:31:04.652215'),(24,'sites','0002_alter_domain_unique','2020-03-11 12:31:04.721222'),(25,'socialaccount','0001_initial','2020-03-11 16:35:32.945532'),(26,'socialaccount','0002_token_max_lengths','2020-03-11 16:35:34.230905'),(27,'socialaccount','0003_extra_data_default_dict','2020-03-11 16:35:34.274904'),(28,'crmapp','0002_inhibitorantibody','2020-04-14 09:36:31.106841'),(29,'endpoints','0001_initial','2020-04-14 14:28:16.374059');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-15 17:02:46
