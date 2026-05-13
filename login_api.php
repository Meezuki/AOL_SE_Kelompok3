<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if(isset($data['login_id']) && isset($data['password'])) {
    
    $login_id = $data['login_id'];
    $password_input = $data['password'];

    // Cari user berdasarkan email ATAU username
    $stmt = $conn->prepare("SELECT id, username, password, role, email FROM users WHERE email = ? OR username = ?");
    $stmt->bind_param("ss", $login_id, $login_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        // Verifikasi password input dengan hash yang ada di database
        if(password_verify($password_input, $user['password'])) {
            // Password cocok! 
            // Kita kembalikan data user (kecuali password) agar bisa disimpan di browser (localStorage)
            echo json_encode([
                "status" => "success", 
                "message" => "Login berhasil!",
                "data" => [
                    "id" => $user['id'],
                    "username" => $user['username'],
                    "role" => $user['role'],
                    "email" => $user['email']
                ]
            ]);
        } else {
            // Jika akun lama yang belum di-hash (seperti admin123), kita buat pengecualian sementara agar tetap bisa login
            if($password_input === $user['password']) {
                 echo json_encode([
                    "status" => "success", 
                    "message" => "Login berhasil (Akun Legacy)!",
                    "data" => [
                        "id" => $user['id'],
                        "username" => $user['username'],
                        "role" => $user['role']
                    ]
                ]);
            } else {
                echo json_encode(["status" => "error", "message" => "Password salah."]);
            }
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Akun tidak ditemukan."]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Mohon isi form dengan lengkap."]);
}

$conn->close();
?>