<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

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

header("Content-Type: application/json");

$judul = trim($_POST["judul"] ?? "");
$deskripsi = trim($_POST["deskripsi"] ?? "");

if ($judul === "") {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Judul galeri wajib diisi"
    ]);

    exit;
}

if (!isset($_FILES["gambar"])) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Gambar wajib dipilih"
    ]);

    exit;
}

$file = $_FILES["gambar"];

if ($file["error"] !== UPLOAD_ERR_OK) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Gagal mengupload gambar"
    ]);

    exit;
}

$maxSize = 5 * 1024 * 1024;

if ($file["size"] > $maxSize) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Ukuran gambar maksimal 5 MB"
    ]);

    exit;
}

$allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$fileType = finfo_file($finfo, $file["tmp_name"]);
finfo_close($finfo);

if (!in_array($fileType, $allowedTypes)) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Format gambar harus JPG, PNG, atau WEBP"
    ]);

    exit;
}

$extension = match ($fileType) {
    "image/jpeg" => "jpg",
    "image/png" => "png",
    "image/webp" => "webp"
};

$fileName = uniqid("galeri_", true) . "." . $extension;

$uploadDir = "../../uploads/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$filePath = $uploadDir . $fileName;

if (!move_uploaded_file($file["tmp_name"], $filePath)) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal menyimpan gambar"
    ]);

    exit;
}

try {

    $query = $pdo->prepare(
        "INSERT INTO galeri
        (judul, gambar, deskripsi)
        VALUES
        (:judul, :gambar, :deskripsi)"
    );

    $query->execute([
        ":judul" => $judul,
        ":gambar" => $fileName,
        ":deskripsi" => $deskripsi
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Galeri berhasil ditambahkan"
    ]);

} catch (PDOException $e) {

    if (file_exists($filePath)) {
        unlink($filePath);
    }

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal menyimpan data galeri",
        "error" => $e->getMessage()
    ]);
}