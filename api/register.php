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

function validate(array $body, array $files): array {
    global $districts;
    $errors = [];

    if (trim($body['name'] ?? '') === '') {
        $errors['name'] = 'name_required';
    }

    $email = trim($body['email'] ?? '');
    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'email_invalid';
    }

    $phone = trim($body['phone'] ?? '');
    if ($phone === '') {
        $errors['phone'] = 'phone_required';
    } else {
        $digits = preg_replace('/\D/', '', $phone);
        if (strlen($digits) < 7 || !preg_match('/^\+?[0-9][0-9\s\-()]{5,19}$/', $phone)) {
            $errors['phone'] = 'phone_invalid';
        }
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

    $birthTime = trim($body['birthTime'] ?? '');
    if ($birthTime === '') {
        $errors['birthTime'] = 'birth_time_required';
    } elseif (!preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $birthTime)) {
        $errors['birthTime'] = 'birth_time_invalid';
    }

    $photo = $files['photo'] ?? null;
    if (!$photo || ($photo['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE || empty($photo['tmp_name'])) {
        $errors['photo'] = 'photo_required';
    } elseif (($photo['error'] ?? 0) !== UPLOAD_ERR_OK) {
        $errors['photo'] = 'photo_invalid';
    } elseif (!in_array($photo['type'] ?? '', ['image/png', 'image/jpeg'], true)) {
        $errors['photo'] = 'photo_type';
    } elseif (($photo['size'] ?? 0) > 5 * 1024 * 1024) {
        $errors['photo'] = 'photo_too_large';
    } elseif (($photo['size'] ?? 0) === 0) {
        $errors['photo'] = 'photo_empty';
    }

    return $errors;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['errors' => ['form' => 'err_generic']]);
    exit;
}

$errors = validate($_POST, $_FILES);
if (count($errors) > 0) {
    http_response_code(400);
    echo json_encode(['errors' => $errors]);
    exit;
}

$photoPath = null;
if (is_uploaded_file($_FILES['photo']['tmp_name'])) {
    $ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
    $filename = bin2hex(random_bytes(16)) . ($ext ? ".$ext" : '');
    $dest = __DIR__ . '/uploads/' . $filename;
    if (move_uploaded_file($_FILES['photo']['tmp_name'], $dest)) {
        $photoPath = $filename;
    }
}

if ($photoPath === null) {
    http_response_code(400);
    echo json_encode(['errors' => ['photo' => 'photo_upload_failed']]);
    exit;
}

try {
    $pdo = db_connect();
    $stmt = $pdo->prepare(
        'INSERT INTO registrations (name, email, phone, gender, dob, district, birth_time, photo_path)
         VALUES (:name, :email, :phone, :gender, :dob, :district, :birth_time, :photo_path)'
    );
    $stmt->execute([
        ':name' => $_POST['name'],
        ':email' => trim($_POST['email'] ?? '') !== '' ? $_POST['email'] : null,
        ':phone' => $_POST['phone'],
        ':gender' => $_POST['gender'],
        ':dob' => $_POST['dob'],
        ':district' => $_POST['district'],
        ':birth_time' => $_POST['birthTime'],
        ':photo_path' => $photoPath,
    ]);

    http_response_code(201);
    echo json_encode(['id' => (int) $pdo->lastInsertId()]);
} catch (Throwable $e) {
    error_log('registration insert failed: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['errors' => ['form' => 'err_generic']]);
}
