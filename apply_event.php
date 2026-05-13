<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if(isset($data['user_id']) && isset($data['event_id'])) {
    $user_id = $data['user_id'];
    $event_id = $data['event_id'];

    // 1. Cek apakah sudah pernah daftar di event ini agar tidak ganda
    $cek_query = "SELECT id FROM registrations WHERE user_id = ? AND event_id = ?";
    $cek_stmt = $conn->prepare($cek_query);
    $cek_stmt->bind_param("ii", $user_id, $event_id);
    $cek_stmt->execute();
    $cek_result = $cek_stmt->get_result();

    if ($cek_result->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Kamu sudah mendaftar di kegiatan ini! Cek Dashboard."]);
        exit;
    }

    // 2. Jika belum daftar, masukkan ke database
    $insert_query = "INSERT INTO registrations (user_id, event_id, status, attendance) VALUES (?, ?, 'pending', 'absent')";
    $insert_stmt = $conn->prepare($insert_query);
    $insert_stmt->bind_param("ii", $user_id, $event_id);

    if ($insert_stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Berhasil melamar! Silakan tunggu persetujuan dari Organizer."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Terjadi kesalahan pada database."]);
    }

    $cek_stmt->close();
    $insert_stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap."]);
}

$conn->close();
?>