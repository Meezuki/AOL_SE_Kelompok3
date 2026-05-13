<?php
header('Content-Type: application/json');
require 'db.php';

// Ambil semua event yang tanggalnya belum lewat
$query = "SELECT * FROM events WHERE event_date >= NOW() ORDER BY event_date ASC";
$result = $conn->query($query);

$events = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
}

echo json_encode(["status" => "success", "data" => $events]);
$conn->close();
?>