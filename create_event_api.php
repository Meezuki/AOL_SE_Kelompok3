<?php
header('Content-Type: application/json');
require 'db.php';

// Cek apakah data POST masuk
if(isset($_POST['title']) && isset($_POST['created_by'])) {
    
    $title = $_POST['title'];
    $description = $_POST['description'];
    $location = $_POST['location'];
    $event_date = str_replace('T', ' ', $_POST['event_date']) . ':00'; 
    $max_quota = (int)$_POST['max_quota'];
    $available_slots = $max_quota;
    $hours_reward = (int)$_POST['hours_reward'];
    $created_by = (int)$_POST['created_by'];
    
    // Logika Upload Gambar
    $image_path = 'assets/trash_hero_logo.png'; // Default image

    if(isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'assets/uploads/';
        
        // Buat nama file unik agar tidak bentrok
        $fileName = time() . '_' . basename($_FILES['image']['name']);
        $targetFilePath = $uploadDir . $fileName;
        
        // Pindahkan gambar dari temp ke folder uploads
        if(move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
            $image_path = $targetFilePath; // Simpan path baru untuk database
        }
    }

    // Insert ke Database
    $query = "INSERT INTO events (title, description, image_path, location, event_date, max_quota, available_slots, hours_reward, created_by) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
              
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sssssiiii", $title, $description, $image_path, $location, $event_date, $max_quota, $available_slots, $hours_reward, $created_by);

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