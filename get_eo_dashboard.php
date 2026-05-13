<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if(isset($data['user_id'])) {
    $eo_id = $data['user_id'];
    
    // Ambil data lamaran: Nama Pelamar, Nama Event, Status, ID Registrasi
    $query = "SELECT r.id as reg_id, u.username as applicant_name, e.title as event_title, r.status 
              FROM registrations r 
              JOIN events e ON r.event_id = e.id 
              JOIN users u ON r.user_id = u.id 
              WHERE e.created_by = ? 
              ORDER BY r.registered_at DESC";
              
    $stmt = $conn->prepare($query);
    if (!$stmt) { echo json_encode(["status" => "error", "message" => "SQL Error: " . $conn->error]); exit; }

    $stmt->bind_param("i", $eo_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $applicants = [];
    while ($row = $result->fetch_assoc()) {
        $applicants[] = $row;
    }

    echo json_encode(["status" => "success", "data" => $applicants]);
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "ID EO tidak ditemukan."]);
}
$conn->close();
?>