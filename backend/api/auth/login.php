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

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if ($email === "" || $password === "") {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Email dan password wajib diisi"
    ]);

    exit;
}

try {

    $query = $pdo->prepare(
        "SELECT id, nama, email, password
         FROM users
         WHERE email = :email
         LIMIT 1"
    );

    $query->execute([
        ":email" => $email
    ]);

    $user = $query->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user["password"])) {

        http_response_code(401);

        echo json_encode([
            "success" => false,
            "message" => "Email atau password salah"
        ]);

        exit;
    }

    unset($user["password"]);

    echo json_encode([
        "success" => true,
        "message" => "Login berhasil",
        "data" => $user
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Terjadi kesalahan server",
        "error" => $e->getMessage()
    ]);
}