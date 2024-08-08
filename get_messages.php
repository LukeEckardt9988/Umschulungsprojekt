<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

include 'db.php'; // Stelle sicher, dass `db.php` korrekt eingebunden ist

$sql = "SELECT * FROM messages ORDER BY created_at ASC";
$result = $conn->query($sql);

if ($result === false) {
    echo json_encode(['error' => 'Query failed: ' . htmlspecialchars($conn->error)]);
    exit;
}

$messages = array();
while ($row = $result->fetch_assoc()) {
    // Füge die Bild-URL zur Nachricht hinzu
    if (!empty($row['image'])) {
        $row['image'] = $row['image']; // Hier kannst du auch den URL-Pfad anpassen, falls nötig
    }
    $messages[] = $row;
}

echo json_encode($messages);

$conn->close();
?>