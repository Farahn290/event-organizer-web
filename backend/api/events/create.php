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

$nama_event = trim(
    $data["nama_event"] ?? ""
);

$tanggal = trim(
    $data["tanggal"] ?? ""
);

$lokasi = trim(
    $data["lokasi"] ?? ""
);

$deskripsi = trim(
    $data["deskripsi"] ?? ""
);

if ($nama_event === "" || $tanggal === "") {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Nama event dan tanggal wajib diisi"
    ]);

    exit;
}

try {

    $query = $pdo->prepare(
        "INSERT INTO events
        (nama_event, tanggal, lokasi, deskripsi)
        VALUES
        (:nama_event, :tanggal, :lokasi, :deskripsi)"
    );

    $query->execute([
        ":nama_event" => $nama_event,
        ":tanggal" => $tanggal,
        ":lokasi" => $lokasi,
        ":deskripsi" => $deskripsi
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Event berhasil ditambahkan",
        "id" => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal menambahkan event",
        "error" => $e->getMessage()
    ]);
}