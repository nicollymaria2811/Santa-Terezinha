-- Schema do Banco de Dados - Santa Terezinha Transporte
-- Estrutura para integração futura com PHP/MySQL

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS santa_terezinha_transporte 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE santa_terezinha_transporte;

-- Tabela de usuários
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('passageiro', 'motorista', 'mecanico', 'gestor') NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20),
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de rotas
CREATE TABLE rotas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    origem VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    duracao VARCHAR(20) NOT NULL,
    tarifa DECIMAL(5,2) NOT NULL,
    status ENUM('operando', 'suspensa', 'manutencao') DEFAULT 'operando',
    ativa BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de horários das rotas
CREATE TABLE horarios_rotas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rota_id INT NOT NULL,
    horario TIME NOT NULL,
    dia_semana ENUM('segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo') NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (rota_id) REFERENCES rotas(id) ON DELETE CASCADE
);

-- Tabela de avisos
CREATE TABLE avisos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    conteudo TEXT NOT NULL,
    tipo ENUM('atraso', 'feriado', 'novidade', 'manutencao', 'geral') NOT NULL,
    prioridade ENUM('baixa', 'media', 'alta', 'critica') DEFAULT 'media',
    ativo BOOLEAN DEFAULT TRUE,
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_expiracao TIMESTAMP NULL,
    autor_id INT,
    FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabela de veículos
CREATE TABLE veiculos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero VARCHAR(20) UNIQUE NOT NULL,
    placa VARCHAR(10) UNIQUE NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    ano INT NOT NULL,
    capacidade INT NOT NULL,
    status ENUM('disponivel', 'em_uso', 'manutencao', 'fora_servico') DEFAULT 'disponivel',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de chamados técnicos
CREATE TABLE chamados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    motorista_id INT NOT NULL,
    veiculo_id INT NOT NULL,
    tipo ENUM('mecanico', 'eletrico', 'pneu', 'outro') NOT NULL,
    descricao TEXT NOT NULL,
    urgencia ENUM('baixa', 'media', 'alta', 'critica') NOT NULL,
    status ENUM('aberto', 'em_andamento', 'resolvido', 'cancelado') DEFAULT 'aberto',
    mecanico_id INT NULL,
    data_abertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_resolucao TIMESTAMP NULL,
    observacoes TEXT NULL,
    FOREIGN KEY (motorista_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE CASCADE,
    FOREIGN KEY (mecanico_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabela de escalas
CREATE TABLE escalas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    motorista_id INT NOT NULL,
    data DATE NOT NULL,
    turno ENUM('manha', 'tarde', 'noite') NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    rota_id INT NOT NULL,
    veiculo_id INT NOT NULL,
    status ENUM('pendente', 'confirmado', 'cancelado') DEFAULT 'pendente',
    observacoes TEXT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (motorista_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (rota_id) REFERENCES rotas(id) ON DELETE CASCADE,
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE CASCADE
);

-- Tabela de checklist de manutenção
CREATE TABLE checklist_manutencao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    veiculo_id INT NOT NULL,
    item VARCHAR(200) NOT NULL,
    concluido BOOLEAN DEFAULT FALSE,
    data_verificacao TIMESTAMP NULL,
    mecanico_id INT NULL,
    observacoes TEXT NULL,
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE CASCADE,
    FOREIGN KEY (mecanico_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabela de mensagens do chat
CREATE TABLE mensagens_chat (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    mensagem TEXT NOT NULL,
    tipo ENUM('user', 'system', 'admin') DEFAULT 'user',
    respondida BOOLEAN DEFAULT FALSE,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de localização GPS (para futura implementação)
CREATE TABLE localizacao_veiculos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    veiculo_id INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    velocidade DECIMAL(5, 2) NULL,
    direcao DECIMAL(5, 2) NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE CASCADE
);

-- Tabela de logs do sistema
CREATE TABLE logs_sistema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NULL,
    acao VARCHAR(100) NOT NULL,
    descricao TEXT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    data_log TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Inserir dados iniciais
INSERT INTO usuarios (username, senha, tipo, nome, email) VALUES
('user1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'passageiro', 'João Silva', 'joao@email.com'),
('motorista1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'motorista', 'Carlos Santos', 'carlos@email.com'),
('mecanico1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mecanico', 'Pedro Oliveira', 'pedro@email.com'),
('gestor1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'gestor', 'Maria Costa', 'maria@email.com');

INSERT INTO rotas (nome, origem, destino, duracao, tarifa) VALUES
('Centro - Bairro São José', 'Centro', 'Bairro São José', '25 min', 3.50),
('Centro - Bairro Industrial', 'Centro', 'Bairro Industrial', '30 min', 3.50),
('Centro - Bairro Universitário', 'Centro', 'Bairro Universitário', '20 min', 3.50),
('Centro - Bairro Rural', 'Centro', 'Bairro Rural', '45 min', 4.00),
('Centro - Terminal Rodoviário', 'Centro', 'Terminal Rodoviário', '15 min', 3.00);

INSERT INTO veiculos (numero, placa, modelo, ano, capacidade) VALUES
('001', 'ABC-1234', 'Mercedes-Benz OF-1722', 2020, 40),
('002', 'DEF-5678', 'Volvo B270F', 2021, 42),
('003', 'GHI-9012', 'Mercedes-Benz OF-1722', 2019, 40),
('004', 'JKL-3456', 'Volvo B270F', 2022, 42),
('005', 'MNO-7890', 'Mercedes-Benz OF-1722', 2020, 40);

-- Inserir horários para as rotas
INSERT INTO horarios_rotas (rota_id, horario, dia_semana) VALUES
-- Centro - Bairro São José (Segunda a Sexta)
(1, '06:00:00', 'segunda'), (1, '06:30:00', 'segunda'), (1, '07:00:00', 'segunda'), (1, '07:30:00', 'segunda'), (1, '08:00:00', 'segunda'),
(1, '08:30:00', 'segunda'), (1, '09:00:00', 'segunda'), (1, '09:30:00', 'segunda'), (1, '10:00:00', 'segunda'), (1, '10:30:00', 'segunda'),
(1, '11:00:00', 'segunda'), (1, '11:30:00', 'segunda'), (1, '12:00:00', 'segunda'), (1, '12:30:00', 'segunda'), (1, '13:00:00', 'segunda'),
(1, '13:30:00', 'segunda'), (1, '14:00:00', 'segunda'), (1, '14:30:00', 'segunda'), (1, '15:00:00', 'segunda'), (1, '15:30:00', 'segunda'),
(1, '16:00:00', 'segunda'), (1, '16:30:00', 'segunda'), (1, '17:00:00', 'segunda'), (1, '17:30:00', 'segunda'), (1, '18:00:00', 'segunda'),
(1, '18:30:00', 'segunda'), (1, '19:00:00', 'segunda'), (1, '19:30:00', 'segunda'), (1, '20:00:00', 'segunda');

-- Inserir avisos iniciais
INSERT INTO avisos (titulo, conteudo, tipo, prioridade, autor_id) VALUES
('Sistema em Manutenção', 'O sistema estará em manutenção programada no domingo, das 2h às 6h.', 'manutencao', 'media', 4),
('Nova Linha', 'A partir de janeiro de 2025, nova linha será inaugurada: Centro - Shopping.', 'novidade', 'baixa', 4),
('Feriado Municipal', 'No dia 15/12, feriado municipal, os horários das linhas serão alterados.', 'feriado', 'media', 4);

-- Inserir checklist de manutenção
INSERT INTO checklist_manutencao (veiculo_id, item) VALUES
(1, 'Verificar nível de óleo do motor'),
(1, 'Verificar nível de água do radiador'),
(1, 'Verificar pressão dos pneus'),
(1, 'Testar sistema de freios'),
(1, 'Verificar funcionamento das luzes'),
(1, 'Verificar sistema de ar condicionado'),
(1, 'Verificar funcionamento das portas'),
(1, 'Verificar limpeza interna e externa');

-- Criar índices para melhor performance
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo);
CREATE INDEX idx_usuarios_username ON usuarios(username);
CREATE INDEX idx_chamados_status ON chamados(status);
CREATE INDEX idx_chamados_motorista ON chamados(motorista_id);
CREATE INDEX idx_escalas_data ON escalas(data);
CREATE INDEX idx_escalas_motorista ON escalas(motorista_id);
CREATE INDEX idx_localizacao_veiculo ON localizacao_veiculos(veiculo_id);
CREATE INDEX idx_localizacao_timestamp ON localizacao_veiculos(timestamp);
CREATE INDEX idx_logs_data ON logs_sistema(data_log);
CREATE INDEX idx_mensagens_tipo ON mensagens_chat(tipo);
CREATE INDEX idx_mensagens_data ON mensagens_chat(data_envio);

