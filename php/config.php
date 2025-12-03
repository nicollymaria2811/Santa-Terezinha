<?php
/**
 * Configuração do Banco de Dados - Santa Terezinha Transporte
 * Arquivo de configuração para integração futura com MySQL
 */

// Configurações do banco de dados
define('DB_HOST', 'localhost');
define('DB_NAME', 'santa_terezinha_transporte');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Configurações da aplicação
define('APP_NAME', 'Santa Terezinha Transporte');
define('APP_VERSION', '1.0.0');
define('APP_URL', 'http://localhost/SantaTerezinhaBus_Antigo');

// Configurações de segurança
define('JWT_SECRET', 'santa_terezinha_secret_key_2024');
define('PASSWORD_HASH_ALGO', PASSWORD_DEFAULT);

// Configurações de API
define('API_BASE_URL', APP_URL . '/api');
define('CORS_ALLOWED_ORIGINS', ['http://localhost', 'http://127.0.0.1']);

// Configurações de upload
define('UPLOAD_MAX_SIZE', 5 * 1024 * 1024); // 5MB
define('UPLOAD_ALLOWED_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'pdf']);

// Configurações de email (para notificações futuras)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', '');
define('SMTP_PASS', '');
define('SMTP_FROM_EMAIL', 'noreply@santaterezinha.com.br');
define('SMTP_FROM_NAME', 'Santa Terezinha Transporte');

// Configurações de cache
define('CACHE_ENABLED', true);
define('CACHE_DURATION', 3600); // 1 hora

// Configurações de logs
define('LOG_ENABLED', true);
define('LOG_LEVEL', 'INFO'); // DEBUG, INFO, WARNING, ERROR
define('LOG_FILE', __DIR__ . '/../logs/app.log');

// Timezone
date_default_timezone_set('America/Sao_Paulo');

/**
 * Classe de conexão com o banco de dados
 */
class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $this->connection = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            error_log("Erro de conexão com o banco: " . $e->getMessage());
            throw new Exception("Erro de conexão com o banco de dados");
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
}

/**
 * Classe de utilitários
 */
class Utils {
    /**
     * Gerar token JWT simples
     */
    public static function generateToken($payload) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode($payload);
        
        $headerEncoded = base64url_encode($header);
        $payloadEncoded = base64url_encode($payload);
        
        $signature = hash_hmac('sha256', $headerEncoded . "." . $payloadEncoded, JWT_SECRET, true);
        $signatureEncoded = base64url_encode($signature);
        
        return $headerEncoded . "." . $payloadEncoded . "." . $signatureEncoded;
    }
    
    /**
     * Validar token JWT
     */
    public static function validateToken($token) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return false;
        }
        
        $header = base64url_decode($parts[0]);
        $payload = base64url_decode($parts[1]);
        $signature = base64url_decode($parts[2]);
        
        $expectedSignature = hash_hmac('sha256', $parts[0] . "." . $parts[1], JWT_SECRET, true);
        
        return hash_equals($signature, $expectedSignature);
    }
    
    /**
     * Sanitizar dados de entrada
     */
    public static function sanitize($data) {
        if (is_array($data)) {
            return array_map([self::class, 'sanitize'], $data);
        }
        return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
    }
    
    /**
     * Validar email
     */
    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
    
    /**
     * Gerar resposta JSON
     */
    public static function jsonResponse($data, $status = 200) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    /**
     * Log de eventos
     */
    public static function log($level, $message, $context = []) {
        if (!LOG_ENABLED) return;
        
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[$timestamp] [$level] $message";
        
        if (!empty($context)) {
            $logMessage .= " " . json_encode($context);
        }
        
        $logMessage .= PHP_EOL;
        
        file_put_contents(LOG_FILE, $logMessage, FILE_APPEND | LOCK_EX);
    }
}

/**
 * Funções auxiliares para base64url
 */
function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
}

/**
 * Configuração de CORS
 */
function setupCORS() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, CORS_ALLOWED_ORIGINS)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// Configurar CORS
setupCORS();

// Configurar logs
if (LOG_ENABLED && !file_exists(dirname(LOG_FILE))) {
    mkdir(dirname(LOG_FILE), 0755, true);
}
?>

