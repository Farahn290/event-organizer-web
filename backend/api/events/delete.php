<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../../config/database.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "DELETE") {

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

if (!$id) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "ID event wajib diisi"
    ]);

    exit;
}

try {

    $query = $pdo->prepare(
        "DELETE FROM events
         WHERE id = :id"
    );

    $query->execute([
        ":id" => $id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Event berhasil dihapus"
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal menghapus event",
        "error" => $e->getMessage()
    ]);
}