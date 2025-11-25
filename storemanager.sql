-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: localhost    Database: storemanager
-- ------------------------------------------------------
-- Server version	8.4.3

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
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Alat Tulis','Kategori untuk alat tulis kantor','2025-11-25 00:35:56.145','2025-11-25 00:35:56.145'),(2,'Elektronik','Kategori untuk produk elektronik','2025-11-25 00:35:56.153','2025-11-25 00:35:56.153'),(3,'Peralatan Sekolah','Kebutuhan alat tulis dan perlengkapan sekolah','2025-11-25 00:35:56.160','2025-11-25 00:35:56.160'),(4,'Alat Tulis Kantor','ATK untuk operasional kantor dan gudang','2025-11-25 14:37:18.439','2025-11-25 14:37:18.439'),(5,'Elektronik Kasir','Perangkat pendukung kasir dan display','2025-11-25 14:37:18.692','2025-11-25 14:37:18.692'),(6,'Kebersihan','Produk kebersihan gudang dan toko','2025-11-25 14:37:18.757','2025-11-25 14:37:18.757'),(7,'Packaging','Bahan packaging dan logistik','2025-11-25 14:37:18.897','2025-11-25 14:37:18.897'),(8,'Peralatan Display','Kebutuhan etalase dan display toko','2025-11-25 14:37:18.940','2025-11-25 14:37:18.940'),(9,'Furniture Toko','Meja, kursi, dan rak penunjang operasional','2025-11-25 14:37:18.995','2025-11-25 14:37:18.995'),(10,'Keselamatan Kerja','APD dan perlengkapan keamanan gudang','2025-11-25 14:37:19.019','2025-11-25 14:37:19.019');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `categoryId` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `minStock` int NOT NULL DEFAULT '0',
  `unit` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_sku_key` (`sku`),
  KEY `products_categoryId_fkey` (`categoryId`),
  CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Buku Tulis 58 Lembar','SCH-001','Buku tulis isi 58 lembar untuk kebutuhan sekolah sehari-hari.',3,12000.00,160,30,'pcs','2025-11-25 00:35:56.165','2025-11-25 14:37:20.233'),(2,'Pensil HB Premium','SCH-002','Pensil HB dengan kualitas grafit halus dan tahan patah.',3,3500.00,260,40,'pcs','2025-11-25 00:35:56.177','2025-11-25 14:37:20.273'),(3,'Pulpen Gel Hitam','SCH-003','Pulpen gel warna hitam dengan tinta cepat kering.',3,5500.00,125,30,'pcs','2025-11-25 00:35:56.185','2025-11-25 14:37:20.708'),(4,'Penghapus Putih','SCH-004','Penghapus berkualitas untuk pensil tanpa meninggalkan bekas.',3,2500.00,180,40,'pcs','2025-11-25 00:35:56.195','2025-11-25 14:37:19.481'),(5,'Penggaris 30 cm','SCH-005','Penggaris plastik transparan dengan skala jelas.',3,6000.00,60,20,'pcs','2025-11-25 00:35:56.206','2025-11-25 14:37:20.961'),(6,'Spidol Whiteboard','SCH-006','Spidol whiteboard warna hitam dengan tinta pekat.',3,8000.00,90,25,'pcs','2025-11-25 00:35:56.225','2025-11-25 14:37:20.992'),(7,'Tip-X Cair','SCH-007','Penghapus cair untuk koreksi tulisan.',3,7000.00,75,20,'pcs','2025-11-25 00:35:56.241','2025-11-25 00:35:56.241'),(8,'Buku Gambar A4','SCH-008','Buku gambar ukuran A4 kertas tebal.',3,15000.00,85,20,'pcs','2025-11-25 00:35:56.256','2025-11-25 00:35:56.256'),(9,'Kotak Pensil Kanvas','SCH-009','Kotak pensil berbahan kanvas dengan resleting.',3,32000.00,60,15,'pcs','2025-11-25 00:35:56.277','2025-11-25 00:35:56.277'),(10,'Tas Sekolah Anak','SCH-010','Tas sekolah ergonomis dengan kompartemen laptop mini.',3,175000.00,40,10,'pcs','2025-11-25 00:35:56.293','2025-11-25 00:35:56.293'),(11,'Kertas A4 80gsm','OFF-001','Kertas printer ukuran A4 untuk kebutuhan dokumen.',4,48000.00,85,20,'rim','2025-11-25 14:37:19.615','2025-11-25 14:37:20.342'),(12,'Stapler Heavy Duty','OFF-002','Stapler besar untuk dokumen tebal hingga 100 lembar.',4,85000.00,25,5,'pcs','2025-11-25 14:37:19.671','2025-11-25 14:37:19.671'),(13,'Printer Thermal Kasir','ELE-001','Printer thermal kecepatan tinggi untuk struk.',5,950000.00,15,3,'unit','2025-11-25 14:37:19.695','2025-11-25 14:37:20.561'),(14,'Barcode Scanner Wireless','ELE-002','Scanner barcode nirkabel jarak 10 meter.',5,1250000.00,12,2,'unit','2025-11-25 14:37:19.723','2025-11-25 14:37:20.623'),(15,'Display LED Harga','ELE-003','Display harga tiga baris untuk kasir.',5,1850000.00,5,1,'unit','2025-11-25 14:37:19.748','2025-11-25 14:37:19.748'),(16,'Disinfektan Literan','CLN-001','Cairan disinfektan konsentrat untuk gudang.',6,68000.00,60,15,'botol','2025-11-25 14:37:19.780','2025-11-25 14:37:19.780'),(17,'Lap Microfiber','CLN-002','Lap microfiber ukuran besar untuk kebersihan rak.',6,18000.00,75,25,'pcs','2025-11-25 14:37:19.827','2025-11-25 14:37:21.020'),(18,'Sapu Gudang','CLN-003','Sapu khusus lantai gudang dengan gagang aluminium.',6,45000.00,35,10,'pcs','2025-11-25 14:37:19.856','2025-11-25 14:37:19.856'),(19,'Dus Ekspedisi Uk. M','PKG-001','Dus karton ukuran medium untuk pengiriman.',7,9000.00,250,80,'pcs','2025-11-25 14:37:19.873','2025-11-25 14:37:20.742'),(20,'Bubble Wrap Tebal','PKG-002','Bubble wrap ketebalan 10mm untuk barang elektronik.',7,65000.00,30,10,'roll','2025-11-25 14:37:19.896','2025-11-25 14:37:21.108'),(21,'Lakban Bening 100yd','PKG-003','Lakban bening kualitas ekspor.',7,17000.00,90,30,'roll','2025-11-25 14:37:19.914','2025-11-25 14:37:20.773'),(22,'Manekin Dewasa','DIS-001','Manekin full body untuk display pakaian etalase.',8,650000.00,6,2,'unit','2025-11-25 14:37:19.943','2025-11-25 14:37:19.943'),(23,'Rak Display Akrilik','DIS-002','Rak display akrilik 4 tingkat untuk produk kecil.',8,285000.00,9,4,'unit','2025-11-25 14:37:19.961','2025-11-25 14:37:21.073'),(24,'Meja Kasir Modular','FUR-001','Meja kasir dengan laci penyimpanan dan kabel management.',9,2100000.00,6,1,'unit','2025-11-25 14:37:19.997','2025-11-25 14:37:20.814'),(25,'Kursi Staff Hidrolik','FUR-002','Kursi staff dengan penyesuaian tinggi dan sandaran ergonomis.',9,650000.00,6,3,'unit','2025-11-25 14:37:20.024','2025-11-25 14:37:21.184'),(26,'Rak Gudang Heavy Duty','FUR-003','Rak gudang 5 tingkat kapasitas 500kg per tingkat.',9,3200000.00,7,2,'unit','2025-11-25 14:37:20.058','2025-11-25 14:37:20.847'),(27,'Helm Safety Standar SNI','SAFE-001','Helm keselamatan dengan suspensi 6 titik.',10,78000.00,65,10,'pcs','2025-11-25 14:37:20.091','2025-11-25 14:37:20.874'),(28,'Rompi Reflektif','SAFE-002','Rompi dengan strip reflektif untuk area loading dock.',10,95000.00,35,15,'pcs','2025-11-25 14:37:20.124','2025-11-25 14:37:21.156'),(29,'Sepatu Safety Baja','SAFE-003','Sepatu safety ujung baja anti slip.',10,420000.00,28,6,'pasang','2025-11-25 14:37:20.138','2025-11-25 14:37:20.909');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_items`
--

DROP TABLE IF EXISTS `transaction_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transactionId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `transaction_items_transactionId_fkey` (`transactionId`),
  KEY `transaction_items_productId_fkey` (`productId`),
  CONSTRAINT `transaction_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `transaction_items_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `transactions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_items`
--

LOCK TABLES `transaction_items` WRITE;
/*!40000 ALTER TABLE `transaction_items` DISABLE KEYS */;
INSERT INTO `transaction_items` VALUES (1,1,1,40,11500.00,460000.00,'2025-11-25 14:37:20.412'),(2,1,2,60,3200.00,192000.00,'2025-11-25 14:37:20.412'),(3,1,11,15,46000.00,690000.00,'2025-11-25 14:37:20.412'),(4,2,13,3,900000.00,2700000.00,'2025-11-25 14:37:20.663'),(5,2,14,4,1180000.00,4720000.00,'2025-11-25 14:37:20.663'),(6,3,3,25,6000.00,150000.00,'2025-11-25 14:37:20.785'),(7,3,19,50,9500.00,475000.00,'2025-11-25 14:37:20.785'),(8,3,21,30,17500.00,525000.00,'2025-11-25 14:37:20.785'),(9,4,24,2,2050000.00,4100000.00,'2025-11-25 14:37:20.942'),(10,4,26,2,3100000.00,6200000.00,'2025-11-25 14:37:20.942'),(11,4,27,25,76000.00,1900000.00,'2025-11-25 14:37:20.942'),(12,4,29,8,400000.00,3200000.00,'2025-11-25 14:37:20.942'),(13,5,5,30,6200.00,186000.00,'2025-11-25 14:37:21.043'),(14,5,6,20,8200.00,164000.00,'2025-11-25 14:37:21.043'),(15,5,17,15,18500.00,277500.00,'2025-11-25 14:37:21.043'),(16,6,23,6,280000.00,1680000.00,'2025-11-25 14:37:21.205'),(17,6,20,10,66000.00,660000.00,'2025-11-25 14:37:21.205'),(18,6,28,20,92000.00,1840000.00,'2025-11-25 14:37:21.205'),(19,6,25,4,630000.00,2520000.00,'2025-11-25 14:37:21.205');
/*!40000 ALTER TABLE `transaction_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('MASUK','KELUAR') COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `totalAmount` decimal(10,2) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,'MASUK','PO-2024-001','Restock alat tulis',1342000.00,'2025-11-25 14:37:20.412','2025-11-25 14:37:20.412'),(2,'MASUK','PO-2024-002','Restock elektronik kasir',7420000.00,'2025-11-25 14:37:20.663','2025-11-25 14:37:20.663'),(3,'KELUAR','SO-2024-001','Pengiriman ke cabang A',1150000.00,'2025-11-25 14:37:20.785','2025-11-25 14:37:20.785'),(4,'MASUK','PO-2024-003','Pengadaan furniture & keselamatan',15400000.00,'2025-11-25 14:37:20.942','2025-11-25 14:37:20.942'),(5,'KELUAR','SO-2024-002','Stok untuk event sekolah',627500.00,'2025-11-25 14:37:21.043','2025-11-25 14:37:21.043'),(6,'KELUAR','SO-2024-003','Pembukaan cabang baru',6700000.00,'2025-11-25 14:37:21.205','2025-11-25 14:37:21.205');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('administrator','user') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@storemanager.com','$2b$10$fNjQmGFVRAksK.auBUkXmuCerupVT5cedq5Js4dWfN7/uAs8904xe','administrator','2025-11-25 00:35:55.960','2025-11-25 15:10:29.544'),(2,'Petugas Gudang','user@storemanager.com','$2b$10$KXtBBG0fE5CovQWqj9bQK.zKEKz.jcKLi5jPdNqFTNqqVN8LvkcqW','user','2025-11-25 00:35:56.133','2025-11-25 00:35:56.133'),(3,'User','user@gmail.com','$2b$10$6GvOW5WVVQcKj2IrSdafq.ciTA36OyJ1K8vjARACDImqOjbbXKFGS','user','2025-11-25 12:50:21.851','2025-11-25 12:50:21.851');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-25 23:05:30
