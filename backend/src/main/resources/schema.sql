-- ===================================================================
-- SMART KISAAN - Production MySQL Database Schema
-- Agmarknet & APMC Compliant Architecture
-- ===================================================================

CREATE DATABASE IF NOT EXISTS smartkisaan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smartkisaan_db;

-- 1. States and Districts
CREATE TABLE IF NOT EXISTS states (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS districts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    state_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE,
    UNIQUE KEY uk_state_district (state_id, name)
) ENGINE=InnoDB;

-- 2. Mandis (APMCs)
CREATE TABLE IF NOT EXISTS mandis (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    district_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    market_type ENUM('PRIMARY', 'SECONDARY', 'SUB_YARD', 'TERMINAL') DEFAULT 'PRIMARY',
    address TEXT,
    pincode VARCHAR(10),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    operating_days VARCHAR(100) DEFAULT 'Monday - Saturday',
    auction_start_time TIME DEFAULT '06:00:00',
    auction_end_time TIME DEFAULT '14:00:00',
    contact_phone VARCHAR(20),
    secretary_name VARCHAR(100),
    has_weighbridge BOOLEAN DEFAULT TRUE,
    has_cold_storage BOOLEAN DEFAULT FALSE,
    has_enam_trading BOOLEAN DEFAULT TRUE,
    apmc_cess_percent DECIMAL(5, 2) DEFAULT 1.50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (district_id) REFERENCES districts(id)
) ENGINE=InnoDB;

-- 3. Crops / Commodities
CREATE TABLE IF NOT EXISTS crops (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL UNIQUE,
    name_hi VARCHAR(100),
    name_ta VARCHAR(100),
    name_te VARCHAR(100),
    name_mr VARCHAR(100),
    name_bn VARCHAR(100),
    category ENUM('CEREALS', 'PULSES', 'OILSEEDS', 'VEGETABLES', 'FRUITS', 'SPICES', 'COMMERCIAL') NOT NULL,
    standard_unit VARCHAR(20) DEFAULT 'QUINTAL',
    msp_price DECIMAL(10, 2) NULL, -- Minimum Support Price where applicable
    shelf_life_days INT DEFAULT 30,
    image_key VARCHAR(50)
) ENGINE=InnoDB;

-- 4. Market Prices (Daily Reported Auctions from APMC / Agmarknet)
CREATE TABLE IF NOT EXISTS market_prices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mandi_id BIGINT NOT NULL,
    crop_id BIGINT NOT NULL,
    variety VARCHAR(100) DEFAULT 'FAQ',
    grade VARCHAR(50) DEFAULT 'Grade A',
    arrival_date DATE NOT NULL,
    arrival_volume_quintals DECIMAL(12, 2) DEFAULT 0.00,
    min_price DECIMAL(10, 2) NOT NULL,
    max_price DECIMAL(10, 2) NOT NULL,
    modal_price DECIMAL(10, 2) NOT NULL,
    previous_modal_price DECIMAL(10, 2) NULL,
    price_trend ENUM('UP', 'DOWN', 'STABLE') DEFAULT 'STABLE',
    data_source VARCHAR(100) DEFAULT 'APMC Verified Daily Feed',
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mandi_id) REFERENCES mandis(id),
    FOREIGN KEY (crop_id) REFERENCES crops(id),
    INDEX idx_crop_date (crop_id, arrival_date),
    INDEX idx_mandi_crop (mandi_id, crop_id),
    INDEX idx_arrival_date (arrival_date)
) ENGINE=InnoDB;

-- 5. Farmers (Users)
CREATE TABLE IF NOT EXISTS farmers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    full_name VARCHAR(150),
    preferred_language VARCHAR(5) DEFAULT 'en',
    state_id BIGINT NULL,
    district_id BIGINT NULL,
    village VARCHAR(150),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    otp_hash VARCHAR(255) NULL,
    otp_expiry TIMESTAMP NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    role ENUM('FARMER', 'ADMIN') DEFAULT 'FARMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES states(id),
    FOREIGN KEY (district_id) REFERENCES districts(id)
) ENGINE=InnoDB;

-- 6. Farmer Preferred Crops
CREATE TABLE IF NOT EXISTS farmer_crops (
    farmer_id BIGINT NOT NULL,
    crop_id BIGINT NOT NULL,
    PRIMARY KEY (farmer_id, crop_id),
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Price Alerts
CREATE TABLE IF NOT EXISTS price_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id BIGINT NOT NULL,
    crop_id BIGINT NOT NULL,
    mandi_id BIGINT NULL, -- Null implies any nearby mandi
    target_price DECIMAL(10, 2) NOT NULL,
    alert_condition ENUM('GREATER_THAN_EQUAL', 'LESS_THAN_EQUAL') DEFAULT 'GREATER_THAN_EQUAL',
    channel ENUM('SMS', 'WHATSAPP', 'IN_APP') DEFAULT 'SMS',
    is_active BOOLEAN DEFAULT TRUE,
    last_triggered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
    FOREIGN KEY (crop_id) REFERENCES crops(id),
    FOREIGN KEY (mandi_id) REFERENCES mandis(id)
) ENGINE=InnoDB;
