
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





-- ------------------------------------------------


-- INSERTS

-- Inserts para a tabela Admin
INSERT INTO Admin (admin_id, admin_name, admin_role, admin_email, admin_password) VALUES
(1, 'Admin Nome 1', 'SuperAdmin', 'admin1@example.com', SHA2('Senha123',256)),
(2, 'Admin Nome 2', 'Admin', 'admin2@example.com', SHA2('Senha123',256)),
(3, 'Admin Nome 3', 'Moderador', 'admin3@example.com', SHA2('Senha123',256)),
(4, 'Admin Nome 4', 'SuperAdmin', 'admin4@example.com', SHA2('Senha123',256)),
(5, 'Admin Nome 5', 'Admin', 'admin5@example.com', SHA2('Senha123',256)),
(6, 'Admin Nome 6', 'Moderador', 'admin6@example.com', SHA2('Senha123',256)),
(7, 'Admin Nome 7', 'SuperAdmin', 'admin7@example.com', SHA2('Senha123',256)),
(8, 'Admin Nome 8', 'Admin', 'admin8@example.com', SHA2('Senha123',256)),
(9, 'Admin Nome 9', 'Moderador', 'admin9@example.com', SHA2('Senha123',256)),
(10, 'Admin Nome 10', 'SuperAdmin', 'admin10@example.com', SHA2('Senha123',256)),
(11, 'Admin Nome 11', 'Admin', 'admin11@example.com', SHA2('Senha123',256)),
(12, 'Admin Nome 12', 'Moderador', 'admin12@example.com', SHA2('Senha123',256)),
(13, 'Admin Nome 13', 'SuperAdmin', 'admin13@example.com', SHA2('Senha123',256)),
(14, 'Admin Nome 14', 'Admin', 'admin14@example.com', SHA2('Senha123',256)),
(15, 'Admin Nome 15', 'Moderador', 'admin15@example.com', SHA2('Senha123',256)),
(16, 'Admin Nome 16', 'SuperAdmin', 'admin16@example.com', SHA2('Senha123',256)),
(17, 'Admin Nome 17', 'Admin', 'admin17@example.com', SHA2('Senha123',256)),
(18, 'Admin Nome 18', 'Moderador', 'admin18@example.com', SHA2('Senha123',256)),
(19, 'Admin Nome 19', 'SuperAdmin', 'admin19@example.com', SHA2('Senha123',256)),
(20, 'Admin Nome 20', 'Moderador', 'admin20@example.com', SHA2('Senha123',256));


-- Inserts para a tabela Donor
INSERT INTO Donor (user_id, donor_document, donor_location, user_name, user_email, user_password, user_status, user_image_url) VALUES
(1,  'DOC00001', 'Cidade 1', 'Donor Nome 1', 'donor1@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor1.jpg'),
(2,  'DOC00002', 'Cidade 2', 'Donor Nome 2', 'donor2@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor2.jpg'),
(3,  'DOC00003', 'Cidade 3', 'Donor Nome 3', 'donor3@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor3.jpg'),
(4,  'DOC00004', 'Cidade 4', 'Donor Nome 4', 'donor4@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor4.jpg'),
(5,  'DOC00005', 'Cidade 5', 'Donor Nome 5', 'donor5@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor5.jpg'),
(6,  'DOC00006', 'Cidade 6', 'Donor Nome 6', 'donor6@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor6.jpg'),
(7,  'DOC00007', 'Cidade 7', 'Donor Nome 7', 'donor7@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor7.jpg'),
(8,  'DOC00008', 'Cidade 8', 'Donor Nome 8', 'donor8@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor8.jpg'),
(9,  'DOC00009', 'Cidade 9', 'Donor Nome 9', 'donor9@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor9.jpg'),
(10, 'DOC00010', 'Cidade 10', 'Donor Nome 10', 'donor10@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor10.jpg'),
(11, 'DOC00011', 'Cidade 11', 'Donor Nome 11', 'donor11@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor11.jpg'),
(12, 'DOC00012', 'Cidade 12', 'Donor Nome 12', 'donor12@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor12.jpg'),
(13, 'DOC00013', 'Cidade 13', 'Donor Nome 13', 'donor13@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor13.jpg'),
(14, 'DOC00014', 'Cidade 14', 'Donor Nome 14', 'donor14@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor14.jpg'),
(15, 'DOC00015', 'Cidade 15', 'Donor Nome 15', 'donor15@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor15.jpg'),
(16, 'DOC00016', 'Cidade 16', 'Donor Nome 16', 'donor16@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor16.jpg'),
(17, 'DOC00017', 'Cidade 17', 'Donor Nome 17', 'donor17@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor17.jpg'),
(18, 'DOC00018', 'Cidade 18', 'Donor Nome 18', 'donor18@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor18.jpg'),
(19, 'DOC00019', 'Cidade 19', 'Donor Nome 19', 'donor19@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor19.jpg'),
(20, 'DOC00020', 'Cidade 20', 'Donor Nome 20', 'donor20@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/donor20.jpg');


-- Inserts para a tabela Ong
INSERT INTO Ong (user_id, ong_description, ong_location, ong_website_url, ong_foundation_date, user_name, user_email, user_password, user_status, user_image_url) VALUES
(1,  'Descrição da ONG 1', 'Cidade ONG 1', 'http://www.ong1.org', '2010-01-01', 'ONG Nome 1', 'ong1@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong1.jpg'),
(2,  'Descrição da ONG 2', 'Cidade ONG 2', 'http://www.ong2.org', '2011-01-01', 'ONG Nome 2', 'ong2@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong2.jpg'),
(3,  'Descrição da ONG 3', 'Cidade ONG 3', 'http://www.ong3.org', '2012-01-01', 'ONG Nome 3', 'ong3@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong3.jpg'),
(4,  'Descrição da ONG 4', 'Cidade ONG 4', 'http://www.ong4.org', '2013-01-01', 'ONG Nome 4', 'ong4@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong4.jpg'),
(5,  'Descrição da ONG 5', 'Cidade ONG 5', 'http://www.ong5.org', '2014-01-01', 'ONG Nome 5', 'ong5@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong5.jpg'),
(6,  'Descrição da ONG 6', 'Cidade ONG 6', 'http://www.ong6.org', '2015-01-01', 'ONG Nome 6', 'ong6@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong6.jpg'),
(7,  'Descrição da ONG 7', 'Cidade ONG 7', 'http://www.ong7.org', '2016-01-01', 'ONG Nome 7', 'ong7@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong7.jpg'),
(8,  'Descrição da ONG 8', 'Cidade ONG 8', 'http://www.ong8.org', '2017-01-01', 'ONG Nome 8', 'ong8@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong8.jpg'),
(9,  'Descrição da ONG 9', 'Cidade ONG 9', 'http://www.ong9.org', '2018-01-01', 'ONG Nome 9', 'ong9@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong9.jpg'),
(10, 'Descrição da ONG 10', 'Cidade ONG 10', 'http://www.ong10.org', '2019-01-01', 'ONG Nome 10', 'ong10@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong10.jpg'),
(11, 'Descrição da ONG 11', 'Cidade ONG 11', 'http://www.ong11.org', '2020-01-01', 'ONG Nome 11', 'ong11@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong11.jpg'),
(12, 'Descrição da ONG 12', 'Cidade ONG 12', 'http://www.ong12.org', '2021-01-01', 'ONG Nome 12', 'ong12@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong12.jpg'),
(13, 'Descrição da ONG 13', 'Cidade ONG 13', 'http://www.ong13.org', '2022-01-01', 'ONG Nome 13', 'ong13@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong13.jpg'),
(14, 'Descrição da ONG 14', 'Cidade ONG 14', 'http://www.ong14.org', '2023-01-01', 'ONG Nome 14', 'ong14@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong14.jpg'),
(15, 'Descrição da ONG 15', 'Cidade ONG 15', 'http://www.ong15.org', '2024-01-01', 'ONG Nome 15', 'ong15@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong15.jpg'),
(16, 'Descrição da ONG 16', 'Cidade ONG 16', 'http://www.ong16.org', '2025-01-01', 'ONG Nome 16', 'ong16@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong16.jpg'),
(17, 'Descrição da ONG 17', 'Cidade ONG 17', 'http://www.ong17.org', '2026-01-01', 'ONG Nome 17', 'ong17@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong17.jpg'),
(18, 'Descrição da ONG 18', 'Cidade ONG 18', 'http://www.ong18.org', '2027-01-01', 'ONG Nome 18', 'ong18@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong18.jpg'),
(19, 'Descrição da ONG 19', 'Cidade ONG 19', 'http://www.ong19.org', '2028-01-01', 'ONG Nome 19', 'ong19@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong19.jpg'),
(20, 'Descrição da ONG 20', 'Cidade ONG 20', 'http://www.ong20.org', '2029-01-01', 'ONG Nome 20', 'ong20@example.com', SHA2('Senha123',256), TRUE, 'http://example.com/images/ong20.jpg');


-- Inserts para a tabela Donation
INSERT INTO Donation (donation_id, donation_method, donation_type, donation_amount, donation_status, donation_is_anonymous, donation_donor_message, donation_currency, fk_Donor_user_id, fk_Ong_user_id) VALUES
(1, 'Cartão de Crédito','Única', 50.00, 'Concluída', FALSE, 'Mensagem doação 1','BRL', 1, 1),
(2, 'Boleto', 'Recorrente', 100.00, 'Pendente',TRUE, 'Mensagem doação 2','BRL', 2, 2),
(3, 'Transferência Bancária','Única', 150.00, 'Cancelada', FALSE, 'Mensagem doação 3', 'BRL', 3, 3),
(4, 'Cartão de Crédito','Recorrente', 200.00, 'Concluída', TRUE, 'Mensagem doação 4','BRL', 4, 4),
(5, 'Boleto','Única', 250.00, 'Pendente', FALSE, 'Mensagem doação 5','BRL', 5, 5),
(6, 'Transferência Bancária','Recorrente', 300.00, 'Cancelada', TRUE, 'Mensagem doação 6', 'BRL', 6, 6),
(7, 'Cartão de Crédito', 'Única', 350.00, 'Concluída', FALSE, 'Mensagem doação 7', 'BRL', 7, 7),
(8, 'Boleto', 'Recorrente', 400.00, 'Pendente', TRUE, 'Mensagem doação 8',  'BRL', 8, 8),
(9, 'Transferência Bancária','Única', 450.00, 'Cancelada', FALSE, 'Mensagem doação 9', 'BRL', 9, 9),
(10, 'Cartão de Crédito','Recorrente', 500.00, 'Concluída',TRUE, 'Mensagem doação 10', 'BRL', 10, 10),
(11, 'Boleto', 'Única', 550.00, 'Pendente', FALSE, 'Mensagem doação 11', 'BRL', 11, 11),
(12, 'Transferência Bancária','Recorrente', 600.00, 'Cancelada', TRUE, 'Mensagem doação 12', 'BRL', 12, 12),
(13, 'Cartão de Crédito', 'Única', 650.00, 'Concluída', FALSE, 'Mensagem doação 13', 'BRL', 13, 13),
(14, 'Boleto', 'Recorrente', 700.00, 'Pendente',TRUE, 'Mensagem doação 14', 'BRL', 14, 14),
(15, 'Transferência Bancária','Única', 750.00, 'Cancelada', FALSE,'Mensagem doação 15', 'BRL', 15, 15),
(16, 'Cartão de Crédito', 'Recorrente', 800.00, 'Concluída', TRUE, 'Mensagem doação 16', 'BRL', 16, 16),
(17, 'Boleto', 'Única', 850.00, 'Pendente', FALSE, 'Mensagem doação 17', 'BRL', 17, 17),
(18, 'Transferência Bancária','Recorrente', 900.00, 'Cancelada', TRUE, 'Mensagem doação 18', 'BRL', 18, 18),
(19, 'Cartão de Crédito', 'Única', 950.00, 'Concluída', FALSE, 'Mensagem doação 19', 'BRL', 19, 19),
(20, 'Boleto', 'Recorrente', 1000.00, 'Pendente', TRUE, 'Mensagem doação 20', 'BRL', 20, 20);


-- Inserts para a tabela Report
INSERT INTO Report (report_id, report_date, report_content) VALUES
(1, '2023-01-01', 'Conteúdo do relatório 1'),
(2, '2023-01-02', 'Conteúdo do relatório 2'),
(3, '2023-01-03', 'Conteúdo do relatório 3'),
(4, '2023-01-04', 'Conteúdo do relatório 4'),
(5, '2023-01-05', 'Conteúdo do relatório 5'),
(6, '2023-01-06', 'Conteúdo do relatório 6'),
(7, '2023-01-07', 'Conteúdo do relatório 7'),
(8, '2023-01-08', 'Conteúdo do relatório 8'),
(9, '2023-01-09', 'Conteúdo do relatório 9'),
(10, '2023-01-10', 'Conteúdo do relatório 10'),
(11, '2023-01-11', 'Conteúdo do relatório 11'),
(12, '2023-01-12', 'Conteúdo do relatório 12'),
(13, '2023-01-13', 'Conteúdo do relatório 13'),
(14, '2023-01-14', 'Conteúdo do relatório 14'),
(15, '2023-01-15', 'Conteúdo do relatório 15'),
(16, '2023-01-16', 'Conteúdo do relatório 16'),
(17, '2023-01-17', 'Conteúdo do relatório 17'),
(18, '2023-01-18', 'Conteúdo do relatório 18'),
(19, '2023-01-19', 'Conteúdo do relatório 19'),
(20, '2023-01-20', 'Conteúdo do relatório 20');



