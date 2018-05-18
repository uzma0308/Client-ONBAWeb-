-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 21, 2018 at 07:06 PM
-- Server version: 5.6.21
-- PHP Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `sql12225688`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE IF NOT EXISTS `category` (
`category_id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `category_name`) VALUES
(1, 'Event'),
(2, 'Important'),
(3, 'Sports'),
(4, 'Placement'),
(5, 'Examination'),
(6, 'General');

-- --------------------------------------------------------

--
-- Table structure for table `category_notice_mapping`
--

CREATE TABLE IF NOT EXISTS `category_notice_mapping` (
`category_notice_id` int(11) NOT NULL,
  `notice_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category_notice_mapping`
--

INSERT INTO `category_notice_mapping` (`category_notice_id`, `notice_id`, `category_id`) VALUES
(11, 4, 5),
(12, 5, 2),
(37, 11, 1),
(38, 11, 5),
(47, 12, 1),
(48, 12, 5),
(54, 14, 6),
(55, 14, 4),
(56, 18, 1),
(57, 19, 1),
(58, 19, 5),
(61, 21, 1),
(62, 21, 5),
(63, 20, 1),
(64, 20, 5),
(65, 20, 6),
(66, 22, 5);

-- --------------------------------------------------------

--
-- Table structure for table `image`
--

CREATE TABLE IF NOT EXISTS `image` (
`image_id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `ref_id` int(11) NOT NULL,
  `image_type` varchar(255) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `image`
--

INSERT INTO `image` (`image_id`, `url`, `ref_id`, `image_type`) VALUES
(51, 'http://localhost:8085/11_2-1524317346932.jpeg', 11, '2'),
(53, 'http://localhost:8085/18_2-1524317752767.jpeg', 18, '2'),
(55, 'http://localhost:8085/14_2-1524317891458.jpeg', 14, '2'),
(56, 'http://localhost:8085/14_2-1524317906798.jpeg', 14, '2'),
(58, 'http://localhost:8085/11_2-1524318033921.jpeg', 11, '2'),
(59, 'http://localhost:8085/19_2-1524322739878.jpeg', 19, '2'),
(60, 'http://localhost:8085/12_2-1524325117638.jpeg', 12, '2'),
(61, 'http://localhost:8085/18_2-1524325309547.jpeg', 18, '2'),
(62, 'http://localhost:8085/11_2-1524326141045.jpeg', 11, '2'),
(63, 'http://localhost:8085/19_2-1524327588832.jpeg', 19, '2'),
(64, 'http://localhost:8085/19_2-1524327599710.jpeg', 19, '2');

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE IF NOT EXISTS `login` (
`Id` int(11) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`Id`, `Email`, `Password`) VALUES
(1, 'uzmaahmed.12@gmail.com', '12345');

-- --------------------------------------------------------

--
-- Table structure for table `notice`
--

CREATE TABLE IF NOT EXISTS `notice` (
`notice_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(500) NOT NULL,
  `full_desc` varchar(21844) NOT NULL,
  `creation_date` datetime NOT NULL,
  `updation_date` datetime NOT NULL,
  `approve` tinyint(1) NOT NULL,
  `comment` varchar(500) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `notice`
--

INSERT INTO `notice` (`notice_id`, `user_id`, `title`, `full_desc`, `creation_date`, `updation_date`, `approve`, `comment`) VALUES
(4, 3, 'Python workshop', 'A python workshop is to be held on 18-April-2018.', '2018-03-15 00:00:00', '2018-04-12 18:15:12', 1, '0'),
(5, 4, 'Color Combination', 'Looking for some already great color combinations? Our color chart features flat design colors, Google''s Material.', '2018-03-20 00:00:00', '2018-04-12 18:15:12', 1, 'Notice successfully approved by Admin'),
(11, 1, 'Final Theory Exam Date sheet. ', 'Datesheet for final examination has been uploaded on the university website.', '2018-04-05 00:00:00', '2018-04-05 00:00:00', 1, 'Notice successfully approved by Admin'),
(12, 1, 'Inceptum is coming.', 'Inceptum for the year 2018 is going to be organised from 19 April 2018. All the interested students', '2018-04-12 00:00:00', '2018-04-12 00:00:00', 1, 'Notice successfully approved by Admin'),
(14, 1, 'Mobile found', 'A mobile was found in the college campus and submitted in academic branch. ', '2018-06-12 18:58:34', '2018-04-15 12:32:23', 1, 'Notice successfully approved by Admin'),
(18, 1, 'External Practicals..', 'External Practicals for all the classes will be held from 1st of March 2018. To get datesheet kindly visit the university website or college website', '2018-04-15 12:39:25', '2018-04-15 14:53:55', 1, ''),
(19, 1, 'Fee Submission', 'This is to inform you that last date for submission of fee for the academic session 2017-2018 is 30 Oct 2017.', '2018-04-15 12:44:52', '2018-04-15 14:58:07', 1, ''),
(20, 1, 'Claim Notices', '\n        Who so ever wants to claim it may contact the office to participate or host shall give their names to their respective CRs.', '2018-04-15 14:48:08', '2018-04-17 14:39:32', 0, 'bccb'),
(21, 1, 'Notice', 'new Notice', '2018-04-17 14:37:11', '2018-04-17 14:37:11', 0, ''),
(22, 1, '', '\n            \n          ', '2018-04-20 23:56:29', '2018-04-20 23:56:29', 2, 'There is no title and content ');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE IF NOT EXISTS `notification` (
`notify_id` int(11) NOT NULL,
  `spam_message` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `notice_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`notify_id`, `spam_message`, `user_id`, `notice_id`) VALUES
(1, 'not allowed', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `register`
--

CREATE TABLE IF NOT EXISTS `register` (
`user_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `unique_no` int(20) NOT NULL,
  `college` varchar(255) NOT NULL,
  `img_id` int(10) NOT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `register`
--

INSERT INTO `register` (`user_id`, `user_name`, `password`, `category`, `unique_no`, `college`, `img_id`, `email`) VALUES
(1, 'uzma', '1234', 'Student', 520907216, 'Gb pant', 2, 'uzmaahmed.12@gmail.com'),
(2, 'xyz', '123456', 'Student', 530907216, 'amity', 2, 'bbbjm@gmail.com'),
(3, 'uz', 'cmxcdm', 'Student', 89789800, '', 0, 'uma@gmail.com'),
(4, 'uzmaaaa', '123445y5', 'Student', 980789889, '', 0, 'ummamaa@gmail.com'),
(5, 'uzzu', '122222', 'Student', 897889878, '', 0, 'ummamaazz@gmail.com'),
(6, 'priya', '12345', 'Student', 520907216, 'gbpant', 0, 'priya@gmail.com'),
(7, 'gaurav', '123456', 'Student', 1862782, 'gb pant', 0, 'gaurav@gmail.com'),
(8, 'dhruv', '12345', 'Student', 62828627, 'gb pant', 0, 'dhruv@gmail.com'),
(9, 'abcd', '12345', 'Faculty', 2147483647, 'gb pant', 0, 'abcd@gmail.com'),
(10, 'pradeep', '12345', 'Faculty', 2147483647, 'gb pant', 0, 'pradeep@gmail.com'),
(11, 'shxbz', '1234', 'Faculty', 2147483647, 'zsjbmns', 0, 'zsb@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
 ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `category_notice_mapping`
--
ALTER TABLE `category_notice_mapping`
 ADD PRIMARY KEY (`category_notice_id`);

--
-- Indexes for table `image`
--
ALTER TABLE `image`
 ADD PRIMARY KEY (`image_id`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
 ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `notice`
--
ALTER TABLE `notice`
 ADD PRIMARY KEY (`notice_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
 ADD PRIMARY KEY (`notify_id`);

--
-- Indexes for table `register`
--
ALTER TABLE `register`
 ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `category_notice_mapping`
--
ALTER TABLE `category_notice_mapping`
MODIFY `category_notice_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=67;
--
-- AUTO_INCREMENT for table `image`
--
ALTER TABLE `image`
MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=65;
--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `notice`
--
ALTER TABLE `notice`
MODIFY `notice_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
MODIFY `notify_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `register`
--
ALTER TABLE `register`
MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
