<?php
// Konfigurasi Database (Sesuaikan dengan XAMPP)
$host = "127.0.0.1";
$user = "root"; // Default username XAMPP
$pass = "";     // Default password XAMPP (kosong)
$dbname = "webpage"; // Sesuai dengan nama database yang kamu import

// Membuat koneksi
$conn = new mysqli($host, $user, $pass, $dbname);

// Cek koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>