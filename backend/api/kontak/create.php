<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

require_once "../../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$nama = trim($data["nama"] ?? "");
$email = trim($data["email"] ?? "");
$no_hp = trim($data["no_hp"] ?? "");
$pesan = trim($data["pesan"] ?? "");

if ($nama === "" || $email === "" || $pesan === "") {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Nama, email, dan pesan wajib diisi"
    ]);

    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Format email tidak valid"
    ]);

    exit;
}

try {

    $stmt = $pdo->prepare("
        INSERT INTO kontak
        (nama, email, no_hp, pesan)
        VALUES
        (:nama, :email, :no_hp, :pesan)
    ");

    $stmt->execute([
        ":nama" => $nama,
        ":email" => $email,
        ":no_hp" => $no_hp,
        ":pesan" => $pesan
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Pesan berhasil dikirim"
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal menyimpan pesan",
        "error" => $e->getMessage()
    ]);
}