-- Tower database
CREATE DATABASE IF NOT EXISTS `tower`;
CREATE USER 'tower'@'%' IDENTIFIED BY 'tower';
GRANT ALL PRIVILEGES ON *.* TO 'tower'@'%';

-- Groundswell database
CREATE DATABASE IF NOT EXISTS `swell`;
CREATE USER 'swell'@'%' IDENTIFIED BY 'swell';
GRANT ALL PRIVILEGES ON *.* TO 'swell'@'%';

FLUSH PRIVILEGES;
