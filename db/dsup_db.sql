CREATE DATABASE IF NOT EXISTS dsup_db;
USE dsup_db;

CREATE TABLE regioes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    sigla VARCHAR(10)
);

CREATE TABLE comarcas (
    id INT AUTO_INCREMENT PRIMARY KEY,    
    nome VARCHAR(100) NOT NULL,
    regiao_id INT,
    FOREIGN KEY (regiao_id) REFERENCES regioes(id)
);

CREATE TABLE precos_servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    regiao_id INT NOT NULL,
    servico_id INT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (regiao_id) REFERENCES regioes(id),
    FOREIGN KEY (servico_id) REFERENCES servicos(id),
    UNIQUE KEY uq_regiao_servico (regiao_id, servico_id)
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nome_completo VARCHAR(100)
);
INSERT INTO regioes (id, nome) VALUES 
(1, 'Noroeste'), 
(2, 'Nordeste'), 
(3, 'Centro Ocidental'), 
(4, 'Centro Oriental'), 
(5, 'Metropolitana'), 
(6, 'Sudeste'), 
(7, 'Sudoeste');

INSERT INTO servicos (id, nome, sigla) VALUES 
(1, 'Instalação', 'inst'), 
(2, 'RolloutAC', 'rac'), 
(3, 'RolloutABC', 'rabc'), 
(4, 'Desinstalação', 'des'), 
(5, 'Mudança Local', 'ml'), 
(6, 'Mudança Predio', 'mp');

INSERT INTO precos_servicos (regiao_id, servico_id, valor) VALUES 
-- Instalação (Serviço 1)
(1, 1, 285.00), (2, 1, 229.00), (3, 1, 233.00), (4, 1, 272.00), (5, 1, 125.00), (6, 1, 273.95), (7, 1, 267.00),
-- RolloutAC (Serviço 2)
(1, 2, 315.00), (2, 2, 261.00), (3, 2, 260.00), (4, 2, 302.00), (5, 2, 143.00), (6, 2, 307.00), (7, 2, 298.21),
-- RolloutABC (Serviço 3)
(1, 3, 352.00), (2, 3, 298.00), (3, 3, 298.00), (4, 3, 339.00), (5, 3, 170.00), (6, 3, 343.00), (7, 3, 335.00),
-- Desinstalação (Serviço 4)
(1, 4, 248.00), (2, 4, 194.00), (3, 4, 194.00), (4, 4, 236.00), (5, 4, 130.00), (6, 4, 239.00), (7, 4, 231.00),
-- Mudança Local (Serviço 5)
(1, 5, 198.00), (2, 5, 152.00), (3, 5, 153.00), (4, 5, 185.00), (5, 5, 160.00), (6, 5, 187.00), (7, 5, 188.00),
-- Mudança Predio (Serviço 6)
(1, 6, 354.00), (2, 6, 300.00), (3, 6, 300.00), (4, 6, 341.00), (5, 6, 150.00), (6, 6, 335.00), (7, 6, 327.00);

INSERT INTO comarcas (nome, regiao_id) VALUES 
('Agudo', 3), ('Alegrete', 7), ('Alvorada', 5), ('Antônio Prado', 2), ('Arroio do Meio', 4), 
('Arroio do Tigre', 4), ('Arroio Grande', 6), ('Arvorezinha', 2), ('Augusto Pestana', 1), 
('Bagé', 7), ('Barra do Ribeiro', 5), ('Bento Gonçalves', 2), ('Bom Jesus', 2), 
('Butiá', 5), ('Caçapava do Sul', 6), ('Cacequi', 3), ('Cachoeira do Sul', 4), 
('Cachoeirinha', 5), ('Camaquã', 5), ('Campina das Missões', 1), ('Campo Bom', 5), 
('Campo Novo', 1), ('Candelária', 4), ('Canela', 5), ('Canguçu', 6), ('Canoas', 5), 
('Capão da Canoa', 5), ('Carazinho', 1), ('Carlos Barbosa', 2), ('Casca', 1), 
('Catuipe', 1), ('Caxias do Sul', 2), ('Cerro Largo', 1), ('Charqueadas', 5), 
('Constantina', 1), ('Coronel Bicaco', 1), ('Crissiumal', 1), ('Cruz Alta', 1), 
('Dois Irmãos', 5), ('Dom Pedrito', 7), ('Eldorado do Sul', 5), ('Encantado', 4), 
('Encruzilhada do Sul', 6), ('Erechim', 1), ('Espumoso', 1), ('Estância Velha', 5), 
('Esteio', 5), ('Estrela', 4), ('Farroupilha', 2), ('Faxinal do Soturno', 3), 
('Feliz', 5), ('Flores da Cunha', 2), ('Frederico Westphalen', 1), ('Garibaldi', 2), 
('Gaurama', 1), ('General Câmara', 5), ('Getúlio Vargas', 1), ('Giruá', 1), 
('Gramado', 5), ('Gravataí', 5), ('Guaíba', 5), ('Guaporé', 2), ('Guarani das Missões', 1), 
('Herval', 6), ('Horizontina', 1), ('Ibirubá', 1), ('Igrejinha', 5), ('Ijuí', 1), 
('Iraí', 1), ('Itaqui', 7), ('Ivoti', 5), ('Jaguarão', 6), ('Jaguari', 3), 
('Júlio de Castilhos', 3), ('Lagoa Vermelha', 2), ('Lajeado', 4), ('Lavras do Sul', 7), 
('Marau', 1), ('Marcelino Ramos', 1), ('Montenegro', 5), ('Mostardas', 5), 
('Não Me Toque', 1), ('Nonoai', 1), ('Nova Petrópolis', 5), ('Nova Prata', 2), 
('Novo Hamburgo', 5), ('Osório', 5), ('Palmares do Sul', 5), ('Palmeira das Missões', 1), 
('Panambi', 1), ('Parobé', 5), ('Passo Fundo', 1), ('Pedro Osório', 6), ('Pelotas', 6), 
('Pinheiro Machado', 6), ('Piratini', 6), ('Planalto', 1), ('Portão', 5), 
('Porto Alegre', 5), ('Porto Xavier', 1), ('Quaraí', 7), ('Restinga Seca', 3), 
('Rio Grande', 6), ('Rio Pardo', 4), ('Rodeio Bonito', 1), ('Ronda Alta', 1), 
('Rosário do Sul', 7), ('Salto do Jacuí', 1), ('Sananduva', 1), ('Santa Bárbara do Sul', 1), 
('Santa Cruz do Sul', 4), ('Santa Maria', 3), ('Santa Rosa', 1), ('Santa Vitória do Palmar', 6), 
('Santana do Livramento', 7), ('Santiago', 3), ('Santo Ângelo', 1), ('Santo Antônio da Patrulha', 5), 
('Santo Antônio das Missões', 1), ('Santo Augusto', 1), ('Santo Cristo', 1), ('São Borja', 7), 
('São Francisco de Assis', 7), ('São Francisco de Paula', 2), ('São Gabriel', 7), 
('São Jerônimo', 5), ('São José do Norte', 6), ('São José do Ouro', 1), ('São Leopoldo', 5), 
('São Lourenço do Sul', 6), ('São Luiz Gonzaga', 1), ('São Marcos', 2), ('São Pedro do Sul', 3), 
('São Sebastião do Caí', 5), ('São Sepé', 3), ('São Valentim', 1), ('São Vicente do Sul', 3), 
('Sapiranga', 5), ('Sapucaia do Sul', 5), ('Sarandi', 1), ('Seberi', 1), ('Sobradinho', 4), 
('Soledade', 1), ('Tapejara', 1), ('Tapera', 1), ('Tapes', 5), ('Taquara', 5), 
('Taquari', 4), ('Tenente Portela', 1), ('Terra de Areia', 5), ('Teutônia', 4), 
('Torres', 5), ('Tramandai', 5), ('Três Coroas', 5), ('Três de Maio', 1), ('Três Passos', 1), 
('Triunfo', 5), ('Tucunduva', 1), ('Tupanciretã', 3), ('Uruguaiana', 7), ('Vacaria', 2), 
('Venâncio Aires', 4), ('Vera Cruz', 4), ('Veranópolis', 2), ('Viamão', 5);
DROP USER IF EXISTS 'dsup_user'@'localhost';
CREATE USER 'dsup_user'@'localhost' IDENTIFIED BY '@Ditic26';
GRANT SELECT, INSERT, UPDATE, DELETE ON dsup_db.* TO 'dsup_user'@'localhost';
FLUSH PRIVILEGES;