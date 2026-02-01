<?php
/**
 * Sterling Legal - Contact Form API
 * Handles form submission and saves to database
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/../config/database.php';

/**
 * Send contact form submission email to admin
 */
function sendContactEmailToAdmin($name, $email, $phone, $message) {
    $adminEmail = defined('ADMIN_EMAIL') ? ADMIN_EMAIL : 'info@sterlinglegal.com';

    $subject = 'New Contact Form Submission - Sterling Legal Partners';
    $phoneDisplay = !empty($phone) ? $phone : 'Not provided';

    $body = "You have received a new message from the contact form.\n\n";
    $body .= "Name: $name\n";
    $body .= "Email: $email\n";
    $body .= "Phone: $phoneDisplay\n\n";
    $body .= "Message:\n$message\n\n";
    $body .= "---\n";
    $body .= "Submitted at: " . date('Y-m-d H:i:s') . "\n";
    $body .= "IP Address: " . ($_SERVER['REMOTE_ADDR'] ?? 'N/A') . "\n";

    // Sanitize for header injection
    $safeName = str_replace(["\r", "\n"], '', $name);
    $safeEmail = str_replace(["\r", "\n"], '', $email);

    $headers = [];
    $headers[] = 'From: Sterling Legal Website <' . $adminEmail . '>';
    $headers[] = 'Reply-To: ' . $safeName . ' <' . $safeEmail . '>';
    $headers[] = 'X-Mailer: PHP/' . phpversion();
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';

    @mail($adminEmail, $subject, $body, implode("\r\n", $headers));
}

// Sanitize and validate input
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Honeypot spam check - if filled, reject
if (!empty($_POST['_gotcha'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid submission']);
    exit;
}

// Validation
$errors = [];

if (strlen($name) < 2 || strlen($name) > 100) {
    $errors[] = 'Name must be between 2 and 100 characters';
}

if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address';
} elseif (strlen($email) > 255) {
    $errors[] = 'Email is too long';
}

if (strlen($phone) > 30) {
    $errors[] = 'Phone number is too long';
}

if (strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters';
} elseif (strlen($message) > 2000) {
    $errors[] = 'Message must not exceed 2000 characters';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['error' => implode('. ', $errors)]);
    exit;
}

$pdo = getDbConnection();

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed. Please try again later.']);
    exit;
}

try {
    $stmt = $pdo->prepare('
        INSERT INTO contact_submissions (name, email, phone, message, ip_address, user_agent)
        VALUES (:name, :email, :phone, :message, :ip_address, :user_agent)
    ');

    $stmt->execute([
        ':name'       => $name,
        ':email'      => $email,
        ':phone'      => $phone ?: null,
        ':message'    => $message,
        ':ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
        ':user_agent' => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500)
    ]);

    // Send email notification to admin (don't fail the request if email fails)
    try {
        sendContactEmailToAdmin($name, $email, $phone, $message);
    } catch (Throwable $e) {
        error_log('Contact form email failed: ' . $e->getMessage());
    }

    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Thank you for your message. We will get back to you within 24 hours.']);
} catch (PDOException $e) {
    error_log('Contact form insert failed: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Unable to save your message. Please try again or call us directly.']);
}
