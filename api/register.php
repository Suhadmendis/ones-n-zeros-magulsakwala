<?php
require __DIR__ . '/db.php';

header('Content-Type: application/json');

$districts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
    'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
    'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
    'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya',
];

function validate(array $body): array {
    global $districts;
    $errors = [];

    if (trim($body['name'] ?? '') === '') {
        $errors['name'] = 'name_required';
    }

    $email = trim($body['email'] ?? '');
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'email_invalid';
    }

    if (!in_array($body['gender'] ?? '', ['male', 'female'], true)) {
        $errors['gender'] = 'gender_required';
    }

    if (empty($body['dob'])) {
        $errors['dob'] = 'dob_required';
    } else {
        $dob = strtotime($body['dob']);
        if ($dob === false) {
            $errors['dob'] = 'dob_invalid';
        } else {
            $age = (time() - $dob) / (60 * 60 * 24 * 365.25);
            if ($age < 18 || $age > 100) {
                $errors['dob'] = 'dob_invalid';
            }
        }
    }

    if (!in_array($body['district'] ?? '', $districts, true)) {
        $errors['district'] = 'district_required';
    }

    return $errors;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['errors' => ['form' => 'err_generic']]);
    exit;
}

$errors = validate($_POST);
if (count($errors) > 0) {
    http_response_code(400);
    echo json_encode(['errors' => $errors]);
    exit;
}

$photoPath = null;
if (!empty($_FILES['photo']['tmp_name']) && is_uploaded_file($_FILES['photo']['tmp_name'])) {
    $ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
    $filename = bin2hex(random_bytes(16)) . ($ext ? ".$ext" : '');
    $dest = __DIR__ . '/uploads/' . $filename;
    if (move_uploaded_file($_FILES['photo']['tmp_name'], $dest)) {
        $photoPath = $filename;
    }
}

try {
    $pdo = db_connect();
    $stmt = $pdo->prepare(
        'INSERT INTO registrations (name, email, gender, dob, district, birth_time, photo_path)
         VALUES (:name, :email, :gender, :dob, :district, :birth_time, :photo_path)'
    );
    $stmt->execute([
        ':name' => $_POST['name'],
        ':email' => $_POST['email'],
        ':gender' => $_POST['gender'],
        ':dob' => $_POST['dob'],
        ':district' => $_POST['district'],
        ':birth_time' => $_POST['birthTime'] ?? null,
        ':photo_path' => $photoPath,
    ]);

    http_response_code(201);
    echo json_encode(['id' => (int) $pdo->lastInsertId()]);
} catch (Throwable $e) {
    error_log('registration insert failed: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['errors' => ['form' => 'err_generic']]);
}
