<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if(
    isset($data['title']) && isset($data['description']) && 
    isset($data['location']) && isset($data['event_date']) && 
    isset($data['max_quota']) && isset($data['hours_reward']) && 
    isset($data['created_by'])
) {
    $title = $data['title'];
    $description = $data['description'];
    $location = $data['location'];
    
    // Sesuaikan format datetime dari HTML agar cocok dengan MySQL (YYYY-MM-DD HH:MM:SS)
    $event_date = str_replace('T', ' ', $data['event_date']) . ':00'; 
    
    $max_quota = (int)$data['max_quota'];
    $available_slots = $max_quota; // Saat awal dibuat, slot tersedia = kuota maksimal
    $hours_reward = (int)$data['hours_reward'];
    $created_by = (int)$data['created_by'];

    $query = "INSERT INTO events (title, description, location, event_date, max_quota, available_slots, hours_reward, created_by) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
              
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssssiiii", $title, $description, $location, $event_date, $max_quota, $available_slots, $hours_reward, $created_by);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Event berhasil dipublikasikan!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal membuat event: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Data formulir tidak lengkap."]);
}

$conn->close();
?>