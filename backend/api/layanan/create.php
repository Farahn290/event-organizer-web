<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../../config/database.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Method tidak diperbolehkan"
    ]);

    exit;
}

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$nama_layanan = trim(
    $data["nama_layanan"] ?? ""
);

$deskripsi = trim(
    $data["deskripsi"] ?? ""
);

if ($nama_layanan === "") {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Nama layanan wajib diisi"
    ]);

    exit;
}

try {

    $query = $pdo->prepare(
        "INSERT INTO layanan
        (nama_layanan, deskripsi)
        VALUES
        (:nama_layanan, :deskripsi)"
    );

    $query->execute([
        ":nama_layanan" => $nama_layanan,
        ":deskripsi" => $deskripsi
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Layanan berhasil ditambahkan",
        "id" => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal menambahkan layanan",
        "error" => $e->getMessage()
    ]);
}