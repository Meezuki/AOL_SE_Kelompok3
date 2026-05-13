<?php
header('Content-Type: application/json'); // Format kembalian ke JS
require 'db.php'; // Panggil koneksi database

// Mengambil data JSON yang dikirim oleh JavaScript (Fetch API)
$data = json_decode(file_get_contents("php://input"), true);

if(isset($data['username']) && isset($data['email']) && isset($data['password']) && isset($data['role'])) {
    
    $username = $data['username'];
    $email = $data['email'];
    // Enkripsi password untuk keamanan (Wajib!)
    $password = password_hash($data['password'], PASSWORD_BCRYPT); 
    
    // Mapping role dari Frontend ('volunteer'/'eo') ke Database ('user'/'organizer')
    $frontend_role = $data['role'];
    $db_role = ($frontend_role === 'eo') ? 'organizer' : 'user';

    // Gunakan Prepared Statement untuk mencegah SQL Injection
    $stmt = $conn->prepare("INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $username, $password, $db_role, $email);

    if($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Akun berhasil dibuat! Silakan Log In."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Username atau Email sudah terdaftar."]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap."]);
}

$conn->close();
?>