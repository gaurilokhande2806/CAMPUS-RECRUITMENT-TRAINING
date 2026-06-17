-- Tailor Management System Database Schema & Seed Data
-- Target Database: MySQL 8.0+

CREATE DATABASE IF NOT EXISTS tailor_db;
USE tailor_db;

-- -----------------------------------------------------
-- Table structure for table `users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `inventory_logs`;
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `measurements`;
DROP TABLE IF EXISTS `inventory`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `role` VARCHAR(20) NOT NULL, -- 'ADMIN', 'DESIGNER', 'TAILOR'
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table structure for table `customers`
-- -----------------------------------------------------
CREATE TABLE `customers` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `status` VARCHAR(20) DEFAULT 'ACTIVE', -- 'ACTIVE', 'INACTIVE'
  `last_visit` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table structure for table `measurements`
-- -----------------------------------------------------
CREATE TABLE `measurements` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` BIGINT NOT NULL,
  `chest` DOUBLE DEFAULT NULL,
  `shoulder` DOUBLE DEFAULT NULL,
  `sleeve` DOUBLE DEFAULT NULL,
  `neck` DOUBLE DEFAULT NULL,
  `waist` DOUBLE DEFAULT NULL,
  `hip` DOUBLE DEFAULT NULL,
  `pant_length` DOUBLE DEFAULT NULL,
  `inseam` DOUBLE DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `version_num` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_measurements_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table structure for table `orders`
-- -----------------------------------------------------
CREATE TABLE `orders` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` BIGINT NOT NULL,
  `order_number` VARCHAR(50) UNIQUE NOT NULL,
  `dress_type` VARCHAR(100) NOT NULL, -- e.g., 'Sherwani', '3-Piece Suit', 'Lehenga', 'Shirt', 'Tuxedo'
  `status` VARCHAR(50) NOT NULL, -- 'PENDING', 'CUTTING', 'STITCHING', 'READY', 'DELIVERED'
  `priority` VARCHAR(20) NOT NULL, -- 'URGENT', 'NEAR_DEADLINE', 'ON_SCHEDULE'
  `delivery_date` DATE NOT NULL,
  `assigned_tailor` VARCHAR(100) DEFAULT NULL,
  `payment_status` VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'PARTIAL', 'PAID'
  `total_amount` DOUBLE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table structure for table `inventory`
-- -----------------------------------------------------
CREATE TABLE `inventory` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `fabric_name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(50) NOT NULL, -- 'Wool', 'Silk', 'Linen', 'Cotton', 'Velvet'
  `available_qty` DOUBLE NOT NULL, -- in meters
  `unit_price` DOUBLE NOT NULL,
  `supplier` VARCHAR(100) NOT NULL,
  `status` VARCHAR(20) NOT NULL, -- 'IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'
  `min_alert_qty` DOUBLE DEFAULT 10.0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table structure for table `inventory_logs`
-- -----------------------------------------------------
CREATE TABLE `inventory_logs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `item_id` BIGINT NOT NULL,
  `change_qty` DOUBLE NOT NULL,
  `log_type` VARCHAR(20) NOT NULL, -- 'CONSUMPTION', 'RESTOCK'
  `remarks` VARCHAR(255) DEFAULT NULL,
  `logged_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_inv_logs_item` FOREIGN KEY (`item_id`) REFERENCES `inventory` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table structure for table `invoices`
-- -----------------------------------------------------
CREATE TABLE `invoices` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `order_id` BIGINT NOT NULL,
  `invoice_number` VARCHAR(50) UNIQUE NOT NULL,
  `gst_amount` DOUBLE NOT NULL,
  `discount_amount` DOUBLE DEFAULT 0.0,
  `subtotal` DOUBLE NOT NULL,
  `grand_total` DOUBLE NOT NULL,
  `payment_status` VARCHAR(20) NOT NULL, -- 'PAID', 'UNPAID'
  `payment_method` VARCHAR(50) DEFAULT NULL, -- 'CASH', 'CARD', 'UPI'
  `qr_payload` VARCHAR(255) DEFAULT NULL,
  `generated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_invoices_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Seeding Mock Data
-- -----------------------------------------------------

-- Seed Users (Passwords are plaintext for demo simplicity. Role control works in app)
INSERT INTO `users` (`username`, `password`, `full_name`, `email`, `role`) VALUES
('admin', 'admin123', 'Administrator', 'admin@tailorsystem.com', 'ADMIN'),
('designer', 'designer123', 'Sonia Malhotra (Designer)', 'sonia@tailorsystem.com', 'DESIGNER'),
('tailor1', 'tailor123', 'Master Aslam (Senior Tailor)', 'aslam@tailorsystem.com', 'TAILOR'),
('tailor2', 'tailor123', 'Master Bahadur (Stitcher)', 'bahadur@tailorsystem.com', 'TAILOR');

-- Seed Customers
INSERT INTO `customers` (`id`, `name`, `phone`, `email`, `status`, `last_visit`) VALUES
(1, 'Rajesh Kumar', '+91 98765 43210', 'rajesh.kumar@gmail.com', 'ACTIVE', '2026-06-10'),
(2, 'Priya Sharma', '+91 87654 32109', 'priya.sharma@yahoo.com', 'ACTIVE', '2026-06-12'),
(3, 'Amit Patel', '+91 76543 21098', 'amit.patel@outlook.com', 'ACTIVE', '2026-06-08'),
(4, 'Siddharth Malhotra', '+91 91234 56789', 'sid.malhotra@gmail.com', 'ACTIVE', '2026-06-14'),
(5, 'Vikram Singh', '+91 99887 76655', 'vikram.singh@gmail.com', 'INACTIVE', '2026-04-20'),
(6, 'Sneha Reddy', '+91 88776 65544', 'sneha.reddy@gmail.com', 'ACTIVE', '2026-06-15'),
(7, 'Arjun Mehta', '+91 77665 54433', 'arjun.mehta@gmail.com', 'ACTIVE', '2026-06-05');

-- Seed Measurements (Linking to seeded customers)
INSERT INTO `measurements` (`customer_id`, `chest`, `shoulder`, `sleeve`, `neck`, `waist`, `hip`, `pant_length`, `inseam`, `notes`, `version_num`) VALUES
(1, 40.5, 18.0, 24.5, 15.5, 34.0, 42.0, 40.0, 31.0, 'Prefers slim fit. Shoulder pads required.', 1),
(2, 36.0, 15.5, 22.0, 14.0, 28.5, 38.0, 38.5, 29.5, 'Blouse fitting, traditional lehenga cut. High collar neckline.', 1),
(3, 42.0, 19.0, 25.0, 16.5, 38.0, 44.0, 42.0, 32.0, 'Regular fit, side vents for blazer.', 1),
(4, 39.0, 17.5, 24.0, 15.0, 32.0, 40.0, 39.5, 30.5, 'Premium Italian fabric fit, extra room in sleeve length.', 1),
(5, 41.0, 18.5, 24.5, 16.0, 36.0, 42.5, 41.0, 31.5, 'Standard fit. Loose armholes.', 1),
(6, 34.5, 14.5, 21.5, 13.5, 27.0, 36.0, 37.0, 28.0, 'Anarkali style, floor length. Soft canvas inside bust.', 1),
(7, 38.0, 17.0, 23.5, 14.5, 31.0, 38.0, 39.0, 30.0, 'Bandhgala suit fitting. Extra ease at chest.', 1);

-- Seed Inventory Items
INSERT INTO `inventory` (`id`, `fabric_name`, `category`, `available_qty`, `unit_price`, `supplier`, `status`, `min_alert_qty`) VALUES
(1, 'Super 120s Merino Wool (Navy Blue)', 'Wool', 45.5, 1800, 'Raymonds Ltd.', 'IN_STOCK', 10.0),
(2, 'Premium Banarasi Silk (Crimson Red)', 'Silk', 8.2, 3200, 'Banaras Weaves', 'LOW_STOCK', 10.0),
(3, 'Pure Irish Linen (Sandy Beige)', 'Linen', 22.0, 1200, 'Linen Club', 'IN_STOCK', 8.0),
(4, 'Egyptian Giza Cotton (White)', 'Cotton', 60.0, 850, 'Vardhman Mills', 'IN_STOCK', 15.0),
(5, 'Italian Velvet (Emerald Green)', 'Velvet', 4.5, 2500, 'Donear Fabrics', 'LOW_STOCK', 8.0),
(6, 'Brocade Silk (Royal Gold)', 'Silk', 15.0, 2800, 'Sabyasachi Textiles', 'IN_STOCK', 5.0),
(7, 'Tweed Wool (Charcoal Grey)', 'Wool', 0.0, 2100, 'Raymonds Ltd.', 'OUT_OF_STOCK', 12.0);

-- Seed Inventory Logs
INSERT INTO `inventory_logs` (`item_id`, `change_qty`, `log_type`, `remarks`) VALUES
(1, 50.0, 'RESTOCK', 'Initial batch restock from Raymonds'),
(1, -4.5, 'CONSUMPTION', 'Used for Order #ORD-1001'),
(2, 12.0, 'RESTOCK', 'Restocked for wedding season orders'),
(2, -3.8, 'CONSUMPTION', 'Used for Order #ORD-1002'),
(3, 22.0, 'RESTOCK', 'Linen club shipment'),
(4, 60.0, 'RESTOCK', 'Bulk white cotton supply'),
(5, 7.5, 'RESTOCK', 'Imported velvet fabric'),
(5, -3.0, 'CONSUMPTION', 'Used for Order #ORD-1003'),
(7, -15.0, 'CONSUMPTION', 'Used up all stock for batch of winter blazers');

-- Seed Orders
-- Status options: 'PENDING', 'CUTTING', 'STITCHING', 'READY', 'DELIVERED'
-- Priority options: 'URGENT', 'NEAR_DEADLINE', 'ON_SCHEDULE'
INSERT INTO `orders` (`id`, `customer_id`, `order_number`, `dress_type`, `status`, `priority`, `delivery_date`, `assigned_tailor`, `payment_status`, `total_amount`) VALUES
(1, 1, 'ORD-1001', '3-Piece Navy Wool Suit', 'DELIVERED', 'ON_SCHEDULE', '2026-06-10', 'Master Aslam', 'PAID', 15000.0),
(2, 2, 'ORD-1002', 'Banarasi Silk Bridal Lehenga', 'STITCHING', 'URGENT', '2026-06-20', 'Master Aslam', 'PARTIAL', 45000.0),
(3, 3, 'ORD-1003', 'Emerald Green Velvet Sherwani', 'CUTTING', 'NEAR_DEADLINE', '2026-06-24', 'Master Bahadur', 'PENDING', 32000.0),
(4, 4, 'ORD-1004', 'Italian Linen Blazer', 'READY', 'ON_SCHEDULE', '2026-06-18', 'Master Bahadur', 'PAID', 12000.0),
(5, 6, 'ORD-1005', 'Designer Silk Anarkali Suit', 'PENDING', 'ON_SCHEDULE', '2026-06-28', 'Master Aslam', 'PENDING', 18000.0),
(6, 7, 'ORD-1006', 'Royal Gold Bandhgala', 'CUTTING', 'ON_SCHEDULE', '2026-06-29', 'Master Aslam', 'PARTIAL', 25000.0),
(7, 1, 'ORD-1007', 'Premium White Giza Cotton Shirt', 'PENDING', 'URGENT', '2026-06-19', 'Master Bahadur', 'PENDING', 3500.0);

-- Seed Invoices (Link to paid/partially paid orders)
-- GST rate: 18% (e.g. 0.18 * subtotal)
INSERT INTO `invoices` (`order_id`, `invoice_number`, `gst_amount`, `discount_amount`, `subtotal`, `grand_total`, `payment_status`, `payment_method`, `qr_payload`) VALUES
(1, 'INV-2026-001', 2288.13, 0.0, 12711.87, 15000.0, 'PAID', 'UPI', 'upi://pay?pa=tailorcorp@okaxis&pn=TailorManagementSystem&am=15000.00&cu=INR'),
(2, 'INV-2026-002', 6864.40, 2000.0, 40135.60, 45000.0, 'UNPAID', NULL, 'upi://pay?pa=tailorcorp@okaxis&pn=TailorManagementSystem&am=45000.00&cu=INR'),
(4, 'INV-2026-003', 1830.50, 500.0, 10669.50, 12000.0, 'PAID', 'CARD', 'upi://pay?pa=tailorcorp@okaxis&pn=TailorManagementSystem&am=12000.00&cu=INR'),
(6, 'INV-2026-004', 3813.56, 0.0, 21186.44, 25000.0, 'UNPAID', NULL, 'upi://pay?pa=tailorcorp@okaxis&pn=TailorManagementSystem&am=25000.00&cu=INR');
