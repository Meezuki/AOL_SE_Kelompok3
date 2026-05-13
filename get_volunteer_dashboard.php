<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if(isset($data['user_id'])) {
    $user_id = $data['user_id'];
    
    // Query untuk mengambil riwayat lamaran beserta detail event-nya
    $query = "SELECT e.title, e.event_date, e.hours_reward, r.status 
              FROM registrations r 
              JOIN events e ON r.event_id = e.id 
              WHERE r.user_id = ? 
              ORDER BY r.registered_at DESC";
              
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $applications = [];
    $total_hours = 0;
    $target_hours = 30; // Target standar Binusian

    while ($row = $result->fetch_assoc()) {
        $applications[] = $row;
        // Hanya tambahkan jam jika statusnya accepted
        if ($row['status'] === 'accepted') {
            $total_hours += $row['hours_reward'];
        }
    }

    echo json_encode([
        "status" => "success",
        "data" => [
            "total_hours" => $total_hours,
            "target_hours" => $target_hours,
            "applications" => $applications
        ]
    ]);

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "ID User tidak ditemukan."]);
}

$conn->close();
?>