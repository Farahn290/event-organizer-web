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

$id = intval($_POST["id"] ?? 0);
$judul = trim($_POST["judul"] ?? "");
$deskripsi = trim($_POST["deskripsi"] ?? "");

if ($id <= 0 || $judul === "") {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Data tidak lengkap"
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

    $oldData = $query->fetch(PDO::FETCH_ASSOC);

    if (!$oldData) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Data galeri tidak ditemukan"
        ]);

        exit;
    }

    $oldFile = $oldData["gambar"];
    $newFileName = $oldFile;

    if (isset($_FILES["gambar"]) &&
        $_FILES["gambar"]["error"] === UPLOAD_ERR_OK) {

        $file = $_FILES["gambar"];

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
        $fileType = finfo_file(
            $finfo,
            $file["tmp_name"]
        );
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

        $newFileName =
            uniqid("galeri_", true) .
            "." .
            $extension;

        $uploadDir = "../../uploads/";

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $newFilePath =
            $uploadDir .
            $newFileName;

        if (!move_uploaded_file(
            $file["tmp_name"],
            $newFilePath
        )) {

            http_response_code(500);

            echo json_encode([
                "success" => false,
                "message" => "Gagal menyimpan gambar baru"
            ]);

            exit;
        }
    }

    $query = $pdo->prepare(
        "UPDATE galeri
         SET judul = :judul,
             gambar = :gambar,
             deskripsi = :deskripsi
         WHERE id = :id"
    );

    $query->execute([
        ":judul" => $judul,
        ":gambar" => $newFileName,
        ":deskripsi" => $deskripsi,
        ":id" => $id
    ]);

    if (
        isset($_FILES["gambar"]) &&
        $_FILES["gambar"]["error"] === UPLOAD_ERR_OK &&
        $oldFile !== $newFileName &&
        $oldFile !== ""
    ) {

        $oldPath = "../../uploads/" . $oldFile;

        if (file_exists($oldPath)) {
            unlink($oldPath);
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Galeri berhasil diperbarui"
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal memperbarui galeri",
        "error" => $e->getMessage()
    ]);
}