<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if(isset($data['reg_id']) && isset($data['status'])) {
    $reg_id = $data['reg_id'];
    $new_status = $data['status']; // 'accepted' atau 'rejected'

    // Update status di database
    $query = "UPDATE registrations SET status = ? WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("si", $new_status, $reg_id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Status pelamar berhasil diperbarui!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal memperbarui status."]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap."]);
}
$conn->close();
?>