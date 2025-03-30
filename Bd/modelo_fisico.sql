
-- Criação do Bd
DROP DATABASE IF EXISTS Lumen;
CREATE DATABASE Lumen;
USE Lumen;


-- Remoção das Tabelas Existentes (se houver)
DROP TABLE IF EXISTS Donation;
DROP TABLE IF EXISTS Report;
DROP TABLE IF EXISTS Admin;
DROP TABLE IF EXISTS Donor;
DROP TABLE IF EXISTS Ong;


-- Criação da Tabela Admin
CREATE TABLE Admin (
    admin_id INTEGER PRIMARY KEY,
    admin_name VARCHAR(100) NOT NULL,
    admin_role VARCHAR(50) NOT NULL,
    admin_email VARCHAR(100) NOT NULL UNIQUE,
    admin_password VARCHAR(255) NOT NULL
);


-- Criação da Tabela Donor
CREATE TABLE Donor (
    user_id INTEGER PRIMARY KEY,
    donor_document VARCHAR(20) NOT NULL UNIQUE,
    donor_location VARCHAR(100),
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_status BOOLEAN DEFAULT TRUE,
    user_image_url VARCHAR(255)
);


-- Criação da Tabela Ong
CREATE TABLE Ong (
    user_id INTEGER PRIMARY KEY,
    ong_description TEXT,
    ong_location VARCHAR(100),
    ong_website_url VARCHAR(255),
    ong_foundation_date DATE,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_status BOOLEAN DEFAULT TRUE,
    user_image_url VARCHAR(255)
);


-- Criação da Tabela Donation
CREATE TABLE Donation (
    donation_id INTEGER PRIMARY KEY,
    donation_method VARCHAR(50),
    donation_type VARCHAR(50),
    donation_amount DOUBLE NOT NULL,
    donation_status VARCHAR(50),
    donation_is_anonymous BOOLEAN DEFAULT FALSE,
    donation_donor_message TEXT,
    donation_currency VARCHAR(10),
    fk_Donor_user_id INTEGER NOT NULL,
    fk_Ong_user_id INTEGER NOT NULL,
    FOREIGN KEY (fk_Donor_user_id) REFERENCES Donor(user_id),
    FOREIGN KEY (fk_Ong_user_id) REFERENCES Ong(user_id)
);


-- Criação da Tabela Report
CREATE TABLE Report (
    report_id INTEGER PRIMARY KEY,
    report_date DATE NOT NULL,
    report_content TEXT NOT NULL
);





