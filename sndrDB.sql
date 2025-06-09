-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: SnDR
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Partida`
--

DROP TABLE IF EXISTS `Partida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Partida` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_admin` int NOT NULL,
  `id_tablero` int DEFAULT NULL,
  `private` tinyint(1) NOT NULL DEFAULT '1',
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `imagen` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `no_tablero` (`id_tablero`),
  KEY `id_admin` (`id_admin`),
  CONSTRAINT `no_admin` FOREIGN KEY (`id_admin`) REFERENCES `Usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `no_tablero` FOREIGN KEY (`id_tablero`) REFERENCES `Tablero` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Partida`
--

LOCK TABLES `Partida` WRITE;
/*!40000 ALTER TABLE `Partida` DISABLE KEYS */;
/*!40000 ALTER TABLE `Partida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Personaje`
--

DROP TABLE IF EXISTS `Personaje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Personaje` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_tablero` int DEFAULT NULL,
  `nombre` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `imagen` text COLLATE utf8mb4_unicode_ci,
  `coord_X` int DEFAULT NULL,
  `coord_Y` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `noid_partida` (`id_tablero`),
  CONSTRAINT `noid_tablero` FOREIGN KEY (`id_tablero`) REFERENCES `Tablero` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Personaje`
--

LOCK TABLES `Personaje` WRITE;
/*!40000 ALTER TABLE `Personaje` DISABLE KEYS */;
/*!40000 ALTER TABLE `Personaje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Personajes_Usuarios`
--

DROP TABLE IF EXISTS `Personajes_Usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Personajes_Usuarios` (
  `id_personaje` int NOT NULL,
  `id_usuario` int NOT NULL,
  KEY `no_personaje` (`id_personaje`) USING BTREE,
  KEY `no_usuario` (`id_usuario`) USING BTREE,
  CONSTRAINT `no_char` FOREIGN KEY (`id_personaje`) REFERENCES `Personaje` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Personajes_Usuarios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Personajes_Usuarios`
--

LOCK TABLES `Personajes_Usuarios` WRITE;
/*!40000 ALTER TABLE `Personajes_Usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `Personajes_Usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tablero`
--

DROP TABLE IF EXISTS `Tablero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tablero` (
  `id` int NOT NULL,
  `imagen` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tablero`
--

LOCK TABLES `Tablero` WRITE;
/*!40000 ALTER TABLE `Tablero` DISABLE KEYS */;
/*!40000 ALTER TABLE `Tablero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuario`
--

DROP TABLE IF EXISTS `Usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `private` tinyint(1) NOT NULL DEFAULT '0',
  `imagen_perfil` text COLLATE utf8mb4_unicode_ci,
  `horas_jugadas` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuario`
--

LOCK TABLES `Usuario` WRITE;
/*!40000 ALTER TABLE `Usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `Usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuarios_Partidas`
--

DROP TABLE IF EXISTS `Usuarios_Partidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuarios_Partidas` (
  `id_usuario` int DEFAULT NULL,
  `id_partida` int DEFAULT NULL,
  KEY `no_us` (`id_usuario`),
  KEY `no_part` (`id_partida`),
  CONSTRAINT `no_part` FOREIGN KEY (`id_partida`) REFERENCES `Partida` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `no_us` FOREIGN KEY (`id_usuario`) REFERENCES `Usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuarios_Partidas`
--

LOCK TABLES `Usuarios_Partidas` WRITE;
/*!40000 ALTER TABLE `Usuarios_Partidas` DISABLE KEYS */;
/*!40000 ALTER TABLE `Usuarios_Partidas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-09  6:21:33
