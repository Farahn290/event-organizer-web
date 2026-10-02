<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../../config/database.php";

try {

    $query = $pdo->query(
        "SELECT * FROM layanan ORDER BY id DESC"
    );

    $data = $query->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil data layanan",
        "error" => $e->getMessage()
    ]);
}