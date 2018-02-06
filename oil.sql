-- phpMyAdmin SQL Dump
-- version 3.4.10.1deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 01, 2018 at 10:31 AM
-- Server version: 5.5.43
-- PHP Version: 5.3.10-1ubuntu3.18

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `oil`
--

-- --------------------------------------------------------

--
-- Table structure for table `score_data`
--

CREATE TABLE IF NOT EXISTS `score_data` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `score` float NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=92 ;

--
-- Dumping data for table `score_data`
--

INSERT INTO `score_data` (`id`, `score`, `nickname`, `timestamp`) VALUES
(26, 17.3443, 'Juha', '2016-06-16 13:55:50'),
(28, 36.8714, 'Ville', '2016-06-16 15:27:43'),
(29, 52.8613, 'Teemo', '2016-06-16 15:29:17'),
(30, 35.2344, 'Vilsepi', '2016-06-16 15:52:40'),
(31, 80.7638, 'Juha', '2016-06-16 16:10:11'),
(32, 33.3289, 'Joe', '2016-06-16 16:48:17'),
(33, 58.2138, 'CECH', '2016-06-16 16:48:21'),
(34, 4.74029, 'Juha', '2016-06-16 16:48:38'),
(35, 0.51075, 'LBN', '2016-06-16 16:50:18'),
(36, 8.08839, '??', '2016-06-16 16:50:54'),
(37, 40.155, '??', '2016-06-16 16:54:13'),
(38, 4.11087, 'Liviu', '2016-06-16 16:58:06'),
(39, 58.6626, 'I-H', '2016-06-16 17:05:48'),
(40, 106.987, 'Eki', '2016-06-16 17:05:59'),
(41, 32.6176, 'Tomas', '2016-06-16 17:15:08'),
(42, 4.39165, 'Alyn', '2016-06-16 17:21:30'),
(43, 371.394, 'hjordis', '2016-06-16 17:38:55'),
(44, 74.8379, 'juha', '2016-06-16 18:09:51'),
(45, 59.874, 'Dengei', '2016-06-16 18:41:03'),
(46, 4.91822, 'Pip', '2016-06-16 19:04:58'),
(47, 103.522, 'Juha', '2016-06-16 19:33:25'),
(48, 52.1286, 'MD', '2016-06-16 19:34:01'),
(49, 21.526, 'Teemu', '2016-06-16 19:39:08'),
(50, 108.308, 'Eemeli', '2016-06-16 19:59:32'),
(51, 208.653, 'Eemeli', '2016-06-16 20:03:25'),
(52, 136.823, 'Eemeli', '2016-06-16 20:05:07'),
(53, 449.98, 'Eemeli', '2016-06-16 20:08:15'),
(54, 527.548, 'Eemeli', '2016-06-17 05:18:10'),
(55, 11.6195, 'V', '2016-06-17 05:43:44'),
(56, 10.7088, 'Brent', '2016-06-17 05:43:45'),
(57, 1.08774, 'Allan', '2016-06-17 05:44:05'),
(58, 26.4033, 'Jo', '2016-06-17 05:45:37'),
(59, 231.358, 'Jan-Daniel', '2016-06-17 05:51:14'),
(60, 4.69314, 'Kaye', '2016-06-17 05:55:05'),
(61, 160.899, 'Kaye', '2016-06-17 06:01:31'),
(62, 294.38, 'Vico Sotto', '2016-06-17 06:02:31'),
(63, 124.35, 'Kaye', '2016-06-17 06:08:26'),
(64, 36.809, 'JimL', '2016-06-17 06:46:14'),
(65, 4.74525, 'Jodie', '2016-06-17 06:55:35'),
(66, 26.5402, 'Jerry', '2016-06-17 07:21:45'),
(67, 226.174, 'IPC', '2016-06-17 07:26:40'),
(68, 809.492, 'IPC', '2016-06-17 07:32:18'),
(69, 228.217, 'VicoSotto', '2016-06-17 07:39:45'),
(70, 1, 'Anonymous', '2016-06-17 07:42:00'),
(71, 4.57093, 'KD', '2016-06-17 07:53:38'),
(72, 5052.57, 'Vico Sotto', '2016-06-17 08:04:18'),
(73, 291.241, 'juha', '2016-06-17 09:14:13'),
(74, 291.241, 'juha', '2016-06-17 09:40:19'),
(75, 291.241, 'juha', '2016-06-17 09:44:09'),
(76, 853.284, 'juha', '2016-06-17 09:48:56'),
(77, 40.1142, 'Pylly', '2016-06-17 12:00:48'),
(79, 36.9902, 'Asdsad', '2016-06-17 12:09:44'),
(80, 29.7597, 'Mr. T', '2016-06-23 07:47:57'),
(81, 35.8179, 'Emil Elby', '2016-07-06 12:49:23'),
(82, 46.8709, 'Surtidor', '2016-10-06 20:08:19'),
(83, 91.7143, 'Chris', '2016-11-03 16:34:15'),
(84, 11.5904, 'Tuijjjja', '2016-12-17 11:23:30'),
(85, 0.578793, 'd2s', '2017-02-23 11:29:03'),
(86, 36.1706, 'd2s', '2017-02-23 11:31:33'),
(87, 36.1706, 'd2s', '2017-02-23 11:33:02'),
(88, 19.7475, 'd2s', '2017-02-23 11:35:02'),
(89, 13.9385, 'coco1515', '2017-10-09 10:58:02'),
(90, 1.24997, 'coco1515', '2017-10-09 10:59:53'),
(91, 5.93443, 'Anonymous', '2017-11-09 16:09:58');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
