<?php
/**
 * API REST - Santa Terezinha Transporte
 * Endpoints para integração futura com o frontend
 */

require_once 'config.php';

// --- CORREÇÃO 1: Headers de CORS Completos ---
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); // Permite conexões de qualquer origem (localhost)
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Se o navegador fizer uma pergunta prévia (OPTIONS), responde que SIM e para.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar método da requisição
$method = $_SERVER['REQUEST_METHOD'];
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);

// --- CORREÇÃO 2: Detecção Automática da Pasta (Resolve o erro 404) ---
// Isso faz funcionar independente se a pasta chamar "SantaTerezinhaBus" ou "SantaTerezinhaBus_Antigo"
$scriptName = $_SERVER['SCRIPT_NAME']; 
$path = str_replace($scriptName, '', $path);

// Roteamento da API
switch ($method) {
    case 'GET':
        handleGetRequest($path);
        break;
    case 'POST':
        handlePostRequest($path);
        break;
    case 'PUT':
        handlePutRequest($path);
        break;
    case 'DELETE':
        handleDeleteRequest($path);
        break;
    default:
        Utils::jsonResponse(['error' => 'Método não permitido'], 405);
}

/**
 * Manipular requisições GET
 */
function handleGetRequest($path) {
    // Remove barras extras do início/fim
    $path = trim($path, '/');
    $pathParts = explode('/', $path);
    
    // Pega a primeira parte da rota (ex: 'rotas', 'avisos')
    $endpoint = $pathParts[0] ?? '';

    switch ($endpoint) {
        case 'rotas':
            getRotas();
            break;
        case 'avisos':
            getAvisos();
            break;
        case 'chamados':
            getChamados();
            break;
        case 'escalas':
            getEscalas();
            break;
        case 'veiculos':
            getVeiculos();
            break;
        case 'dashboard':
            getDashboard();
            break;
        case 'mensagens':
            getMensagens();
            break;
        default:
            Utils::jsonResponse(['error' => 'Endpoint não encontrado: ' . $endpoint], 404);
    }
}

/**
 * Manipular requisições POST
 */
function handlePostRequest($path) {
    $path = trim($path, '/');
    $pathParts = explode('/', $path);
    $endpoint = $pathParts[0] ?? '';

    $data = json_decode(file_get_contents('php://input'), true);
    
    switch ($endpoint) {
        case 'login':
            login($data);
            break;
        case 'chamados':
            criarChamado($data);
            break;
        case 'mensagens':
            enviarMensagem($data);
            break;
        case 'checklist':
            atualizarChecklist($data);
            break;
        default:
            Utils::jsonResponse(['error' => 'Endpoint não encontrado'], 404);
    }
}

/**
 * Manipular requisições PUT
 */
function handlePutRequest($path) {
    $path = trim($path, '/');
    $pathParts = explode('/', $path);
    $endpoint = $pathParts[0] ?? '';

    $data = json_decode(file_get_contents('php://input'), true);
    
    switch ($endpoint) {
        case 'chamados':
            if (isset($pathParts[1])) {
                atualizarChamado($pathParts[1], $data);
            } else {
                Utils::jsonResponse(['error' => 'ID do chamado não fornecido'], 400);
            }
            break;
        case 'escalas':
            if (isset($pathParts[1])) {
                atualizarEscala($pathParts[1], $data);
            } else {
                Utils::jsonResponse(['error' => 'ID da escala não fornecido'], 400);
            }
            break;
        default:
            Utils::jsonResponse(['error' => 'Endpoint não encontrado'], 404);
    }
}

/**
 * Manipular requisições DELETE
 */
function handleDeleteRequest($path) {
    $path = trim($path, '/');
    $pathParts = explode('/', $path);
    $endpoint = $pathParts[0] ?? '';
    
    switch ($endpoint) {
        case 'chamados':
            if (isset($pathParts[1])) {
                deletarChamado($pathParts[1]);
            } else {
                Utils::jsonResponse(['error' => 'ID do chamado não fornecido'], 400);
            }
            break;
        default:
            Utils::jsonResponse(['error' => 'Endpoint não encontrado'], 404);
    }
}

/**
 * Endpoints específicos
 */

function getRotas() {
    try {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->query("SELECT * FROM rotas WHERE ativa = 1 ORDER BY nome");
        $rotas = $stmt->fetchAll();
        
        // Buscar horários para cada rota
        foreach ($rotas as &$rota) {
            $stmt = $db->prepare("SELECT horario, dia_semana FROM horarios_rotas WHERE rota_id = ? AND ativo = 1 ORDER BY horario");
            $stmt->execute([$rota['id']]);
            $rota['horarios'] = $stmt->fetchAll();
        }
        
        Utils::jsonResponse(['success' => true, 'data' => $rotas]);
    } catch (Exception $e) {
        Utils::log('ERROR', 'Erro ao buscar rotas: ' . $e->getMessage());
        Utils::jsonResponse(['error' => 'Erro interno do servidor'], 500);
    }
}

function getAvisos() {
    try {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->query("
            SELECT a.*, u.nome as autor_nome 
            FROM avisos a 
            LEFT JOIN usuarios u ON a.autor_id = u.id 
            WHERE a.ativo = 1 
            ORDER BY a.data_publicacao DESC
        ");
        $avisos = $stmt->fetchAll();
        
        Utils::jsonResponse(['success' => true, 'data' => $avisos]);
    } catch (Exception $e) {
        Utils::log('ERROR', 'Erro ao buscar avisos: ' . $e->getMessage());
        Utils::jsonResponse(['error' => 'Erro interno do servidor'], 500);
    }
}

function getChamados() {
    try {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->query("
            SELECT c.*, u1.nome as motorista_nome, u2.nome as mecanico_nome, v.numero as veiculo_numero
            FROM chamados c
            LEFT JOIN usuarios u1 ON c.motorista_id = u1.id
            LEFT JOIN usuarios u2 ON c.mecanico_id = u2.id
            LEFT JOIN veiculos v ON c.veiculo_id = v.id
            ORDER BY c.data_abertura DESC
        ");
        $chamados = $stmt->fetchAll();
        
        Utils::jsonResponse(['success' => true, 'data' => $chamados]);
    } catch (Exception $e) {
        Utils::log('ERROR', 'Erro ao buscar chamados: ' . $e->getMessage());
        Utils::jsonResponse(['error' => 'Erro interno do servidor'], 500);
    }
}

function getEscalas() {
    try {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->query("
            SELECT e.*, u.nome as motorista_nome, r.nome as rota_nome, v.numero as veiculo_numero
            FROM escalas e
            LEFT JOIN usuarios u ON e.motorista_id = u.id
            LEFT JOIN rotas r ON e.rota_id = r.id
            LEFT JOIN veiculos v ON e.veiculo_id = v.id
            WHERE e.data >= CURDATE()
            ORDER BY e.data, e.horario_inicio
        ");
        $escalas = $stmt->fetchAll();
        
        Utils::jsonResponse(['success' => true, 'data' => $escalas]);
    } catch (Exception $e) {
        Utils::log('ERROR', 'Erro ao buscar escalas: ' . $e->getMessage());
        Utils::jsonResponse(['error' => 'Erro interno do servidor'], 500);
    }
}

function getVeiculos() {
    try {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->query("SELECT * FROM veiculos ORDER BY numero");
        $veiculos = $stmt->fetchAll();
        
        Utils::jsonResponse(['success' => true, 'data' => $veiculos]);
    } catch (Exception $e) {
        Utils::log('ERROR', 'Erro ao buscar veículos: ' . $e->getMessage());
        Utils::jsonResponse(['error' => 'Erro interno do servidor'], 500);
    }
}

function getDashboard() {
    try {
        $db = Database::getInstance()->getConnection();
        
        // Status da frota
        $stmt = $db->query("
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'disponivel' THEN 1 ELSE 0 END) as disponiveis,
                SUM(CASE WHEN status = 'manutencao' THEN 1 ELSE 0 END) as em_manutencao,
                SUM(CASE WHEN status = 'fora_servico' THEN 1 ELSE 0 END) as fora_servico
            FROM veiculos
        ");
        $frota = $stmt->fetch();
        
        // Status dos motoristas
        $stmt = $db->query("
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN e.status = 'confirmado' AND e.data = CURDATE() THEN 1 ELSE 0 END) as dirigindo,
                COUNT(*) - SUM(CASE WHEN e.status = 'confirmado' AND e.data = CURDATE() THEN 1 ELSE 0 END) as fora_escala
            FROM usuarios u
            LEFT JOIN escalas e ON u.id = e.motorista_id
            WHERE u.tipo = 'motorista' AND u.ativo = 1
        ");
        $motoristas = $stmt->fetch();
        
        // Chamados abertos
        $stmt = $db->query("SELECT COUNT(*) as chamados_abertos FROM chamados WHERE status = 'aberto'");
        $chamadosAbertos = $stmt->fetch()['chamados_abertos'];
        
        // Mensagens pendentes
        $stmt = $db->query("SELECT COUNT(*) as mensagens_pendentes FROM mensagens_chat WHERE respondida = 0");
        $mensagensPendentes = $stmt->fetch()['mensagens_pendentes'];
        
        $dashboard = [
            'frota' => $frota,
            'motoristas' => $motoristas,
            'chamados_abertos' => $chamadosAbertos,
            'mensagens_pendentes' => $mensagensPendentes
        ];
        
        Utils::jsonResponse(['success' => true, 'data' => $dashboard]);
    } catch (Exception $e) {
        Utils::log('ERROR', 'Erro ao buscar dados do dashboard: ' . $e->getMessage());
        Utils::jsonResponse(['error' => 'Erro interno do servidor'], 500);
    }
}

function getMensagens() {
    try {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->query("
            SELECT m.*, u.nome as usuario_nome
            FROM mensagens_chat m
            LEFT JOIN usuarios u ON m.usuario_id = u.id
            ORDER BY m.data_envio DESC
            LIMIT 50
        ");
        $mensagens = $stmt->fetchAll();
        
        Utils::jsonResponse(['success' => true, 'data' => $mensagens]);
    } catch (Exception $e) {
        Utils::log('ERROR', 'Erro ao buscar mensagens: ' . $e->getMessage());
        Utils::jsonResponse(['error' => 'Erro interno do servidor'], 500);
    }
}

function login($data) {
    try {
        if (!isset($data['username']) || !isset($data['password'])) {
            Utils::jsonResponse(['error' => 'Username e password são obrigatórios'], 400);
            return;
        }
        
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT * FROM usuarios WHERE username = ? AND ativo = 1");
        $stmt->execute([$data['username']]);
        $usuario = $stmt->fetch();
        
        // ATENÇÃO: Se não funcionar com password_verify (porque suas senhas no banco podem não estar criptografadas ainda),
        // troque temporariamente por: if ($usuario && $data['password'] == $usuario['senha']) {
            if ($usuario && password_verify($data['password'], $usuario['senha'])) {
            $token = Utils::generateToken([
                'user_id' => $usuario['id'],
                'username' => $usuario['username'],
                'tipo' => $usuario['tipo'],
                'exp' => time() + (24 * 60 * 60) // 24 horas
            ]);
            
            Utils::log('INFO', 'Login realizado', ['username' => $usuario['username']]);
            
            Utils::jsonResponse([
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => $usuario['id'],
                    'username' => $usuario['username'],
                    'nome' => $usuario['nome'],
                    'tipo' => $usuario['tipo']
                ]
            ]);
        } else {
            Utils::jsonResponse(['error' => 'Credenciais inválidas'], 401);
        }
    } catch (Exception $e) {
        Utils::log('ERROR', 'Erro no login: ' . $e->getMessage());
        Utils::jsonResponse(['error' => 'Erro interno do servidor'], 500);
    }
}

function criarChamado($data) {
    try {
        $requiredFields = ['motorista_id', 'veiculo_id', 'tipo', 'descricao', 'urgencia'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                Utils::jsonResponse(['error' => "Campo obrigatório: $field"], 400);
                return;
            }
        }
        
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("
            INSERT INTO chamados (motorista_id, veiculo_id, tipo, descricao, urgencia) 
            VALUES (?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $data['motorista_id'],
            $data['veiculo_id'],
            $data['tipo'],
            $data['descricao'],
            $data['urgencia']
        ]);
        
        $chamadoId = $db->lastInsertId();
        
        Utils::log('INFO', 'Chamado criado', ['chamado_id' => $chamadoId]);
        
        Utils::jsonResponse([
            'success' => true,
            'message' => 'Chamado criado com sucesso',
            'chamado_id' => $chamadoId
        ]);
    } catch (Exception $e) {
        Utils::log('ERROR', 'Erro ao criar chamado: ' . $e->getMessage());
        Utils::jsonResponse(['error' => 'Erro interno do servidor'], 500);
    }
}

function enviarMensagem($data) {
    try {
        if (!isset($data['usuario_id']) || !isset($data['mensagem'])) {
            Utils::jsonResponse(['error' => 'usuario_id e mensagem são obrigatórios'], 400);
            return;
        }
        
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("
            INSERT INTO mensagens_chat (usuario_id, mensagem, tipo) 
            VALUES (?, ?, ?)
        ");
        
        $stmt->execute([
            $data['usuario_id'],
            $data['mensagem'],
            $data['tipo'] ?? 'user'
        ]);
        
        $mensagemId = $db->lastInsertId();
        
        Utils::log('INFO', 'Mensagem enviada', ['mensagem_id' => $mensagemId]);
        
        Utils::jsonResponse([
            'success' => true,
            'message' => 'Mensagem enviada com sucesso',
            'mensagem_id' => $mensagemId
        ]);
    } catch (Exception $e) {
        Utils::log('ERROR', 'Erro ao enviar mensagem: ' . $e->getMessage());
        Utils::jsonResponse(['error' => 'Erro interno do servidor'], 500);
    }
}

function atualizarChamado($id, $data) {
    try {
        $db = Database::getInstance()->getConnection();
        
        $fields = [];
        $values = [];
        
        if (isset($data['status'])) {
            $fields[] = 'status = ?';
            $values[] = $data['status'];
        }
        
        if (isset($data['mecanico_id'])) {
            $fields[] = 'mecanico_id = ?';
            $values[] = $data['mecanico_id'];
        }
        
        if (isset($data['observacoes'])) {
            $fields[] = 'observacoes = ?';
            $values[] = $data['observacoes'];
        }
        
        if (isset($data['status']) && $data['status'] === 'resolvido') {
            $fields[] = 'data_resolucao = NOW()';
        }
        
        if (empty($fields)) {
            Utils::jsonResponse(['error' => 'Nenhum campo para atualizar'], 400);
            return;
        }
        
        $values[] = $id;
        
        $sql = "UPDATE chamados SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute($values);
        
        Utils::log('INFO', 'Chamado atualizado', ['chamado_id' => $id]);
        
        Utils::jsonResponse([
            'success' => true,
            'message' => 'Chamado atualizado com sucesso'
        ]);
    } catch (Exception $e) {
        Utils::log('ERROR', 'Erro ao atualizar chamado: ' . $e->getMessage());
        Utils::jsonResponse(['error' => 'Erro interno do servidor'], 500);
    }
}

function atualizarEscala($id, $data) {
    try {
        $db = Database::getInstance()->getConnection();
        
        $fields = [];
        $values = [];
        
        if (isset($data['status'])) {
            $fields[] = 'status = ?';
            $values[] = $data['status'];
        }
        
        if (isset($data['observacoes'])) {
            $fields[] = 'observacoes = ?';
            $values[] = $data['observacoes'];
        }
        
        if (empty($fields)) {
            Utils::jsonResponse(['error' => 'Nenhum campo para atualizar'], 400);
            return;
        }
        
        $values[] = $id;
        
        $sql = "UPDATE escalas SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute($values);
        
        Utils::log('INFO', 'Escala atualizada', ['escala_id' => $id]);
        
        Utils::jsonResponse([
            'success' => true,
            'message' => 'Escala atualizada com sucesso'
        ]);
    } catch (Exception $e) {
        Utils::log('ERROR', 'Erro ao atualizar escala: ' . $e->getMessage());
        Utils::jsonResponse(['error' => 'Erro interno do servidor'], 500);
    }
}

function atualizarChecklist($data) {
    try {
        if (!isset($data['item_id']) || !isset($data['concluido'])) {
            Utils::jsonResponse(['error' => 'item_id e concluido são obrigatórios'], 400);
            return;
        }
        
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("
            UPDATE checklist_manutencao 
            SET concluido = ?, data_verificacao = NOW(), mecanico_id = ?
            WHERE id = ?
        ");
        
        $stmt->execute([
            $data['concluido'] ? 1 : 0,
            $data['mecanico_id'] ?? null,
            $data['item_id']
        ]);
        
        Utils::log('INFO', 'Checklist atualizado', ['item_id' => $data['item_id']]);
        
        Utils::jsonResponse([
            'success' => true,
            'message' => 'Checklist atualizado com sucesso'
        ]);
    } catch (Exception $e) {
        Utils::log('ERROR', 'Erro ao atualizar checklist: ' . $e->getMessage());
        Utils::jsonResponse(['error' => 'Erro interno do servidor'], 500);
    }
}

function deletarChamado($id) {
    try {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("DELETE FROM chamados WHERE id = ?");
        $stmt->execute([$id]);
        
        Utils::log('INFO', 'Chamado deletado', ['chamado_id' => $id]);
        
        Utils::jsonResponse([
            'success' => true,
            'message' => 'Chamado deletado com sucesso'
        ]);
    } catch (Exception $e) {
        Utils::log('ERROR', 'Erro ao deletar chamado: ' . $e->getMessage());
        Utils::jsonResponse(['error' => 'Erro interno do servidor'], 500);
    }
}
?>