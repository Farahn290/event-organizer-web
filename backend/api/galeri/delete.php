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

$id = intval($data["id"] ?? 0);

if ($id <= 0) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "ID tidak valid"
    ]);

    exit;
}

try {

    $query = $pdo->prepare(
        "SELECT gambar
         FROM galeri
         WHERE id = :id"
    );

    $query->execute([
        ":id" => $id
    ]);

    $data = $query->fetch(PDO::FETCH_ASSOC);

    if (!$data) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Data galeri tidak ditemukan"
        ]);

        exit;
    }

    $query = $pdo->prepare(
        "DELETE FROM galeri
         WHERE id = :id"
    );

    $query->execute([
        ":id" => $id
    ]);

    if (!empty($data["gambar"])) {

        $filePath =
            "../../uploads/" .
            $data["gambar"];

        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Galeri berhasil dihapus"
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal menghapus galeri",
        "error" => $e->getMessage()
    ]);
}