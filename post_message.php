<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: text/plain');

include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $content = $_POST['content'];
    $imagePath = '';

    // Überprüfe, ob eine Datei hochgeladen wurde
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $image = $_FILES['file'];
        $uploadDir = 'uploads/';
        $uploadFile = $uploadDir . basename($image['name']);

        // Verzeichnis sicherstellen
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Verschiebe die hochgeladene Datei in das Upload-Verzeichnis
        if (move_uploaded_file($image['tmp_name'], $uploadFile)) {
            $imagePath = $uploadFile;
        } else {
            echo 'Failed to move uploaded file.';
            exit;
        }
    }

    // Überprüfe, ob der Benutzername und der Inhalt vorhanden sind
    if (empty($username) || empty($content)) {
        echo 'Username and content are required.';
        exit;
    }

    // Daten in die Datenbank einfügen
    $stmt = $conn->prepare("INSERT INTO messages (username, content, image) VALUES (?, ?, ?)");
    if ($stmt === false) {
        echo 'Prepare failed: ' . htmlspecialchars($conn->error);
        exit;
    }

    $stmt->bind_param("sss", $username, $content, $imagePath);
    if ($stmt->execute()) {
        echo 'Message sent successfully';
    } else {
        echo 'Execute failed: ' . htmlspecialchars($stmt->error);
    }

    $stmt->close();
    $conn->close();
} else {
    echo 'Invalid request method.';
}
?>
//Akteueller Code