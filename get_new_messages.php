<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

include 'db.php';

$lastMessageId = isset($_GET['last_id']) ? (int)$_GET['last_id'] : 0;

$sql = "SELECT * FROM messages WHERE id > ? ORDER BY created_at ASC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $lastMessageId);
$stmt->execute();
$result = $stmt->get_result();

$messages = array();
while ($row = $result->fetch_assoc()) {
    if (!empty($row['image'])) {
        $row['image'] = $row['image'];
    }
    $messages[] = $row;
}

echo json_encode($messages);

$stmt->close();
$conn->close();
?>
