<?php
/**
 * Sterling Legal - Database Configuration
 * Update these values for your MySQL/MariaDB server
 * Do not access this file directly - it is included by api/contact.php
 */

if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === 'database.php') {
    http_response_code(403);
    exit('Forbidden');
}

define('DB_HOST', 'localhost');
define('DB_NAME', 'sterling_legal');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Admin email - receives contact form submissions
define('ADMIN_EMAIL', 'info@sterlinglegal.com');

/**
 * Get PDO database connection
 * @return PDO|null
 */
function getDbConnection() {
    static $pdo = null;

    if ($pdo === null) {
        try {
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log('Database connection failed: ' . $e->getMessage());
            return null;
        }
    }

    return $pdo;
}
