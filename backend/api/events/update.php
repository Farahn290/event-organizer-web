<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../../config/database.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "PUT") {

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

$id = $data["id"] ?? null;

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

if (!$id || $nama_event === "" || $tanggal === "") {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "ID, nama event, dan tanggal wajib diisi"
    ]);

    exit;
}

try {

    $query = $pdo->prepare(
        "UPDATE events
         SET nama_event = :nama_event,
             tanggal = :tanggal,
             lokasi = :lokasi,
             deskripsi = :deskripsi
         WHERE id = :id"
    );

    $query->execute([
        ":nama_event" => $nama_event,
        ":tanggal" => $tanggal,
        ":lokasi" => $lokasi,
        ":deskripsi" => $deskripsi,
        ":id" => $id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Event berhasil diperbarui"
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal memperbarui event",
        "error" => $e->getMessage()
    ]);
}