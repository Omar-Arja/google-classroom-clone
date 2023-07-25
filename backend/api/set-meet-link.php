<?php

include('connection.php');


$class_id = $_POST['class_id'];
$meet_link = $_POST['meet_link'];

$query = $mysqli->prepare('update classes set meet_link = ? where class_id = ?');
$query->bind_param('si', $meet_link, $class_id);
$query->execute();

if ($query->affected_rows > 0) {
    $response['status'] = 'meet link updated successfully';
}
else {
    $response['status'] = 'failed to update meet link';
}