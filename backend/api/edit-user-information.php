<?php
include('connection.php');

$new_first_name = $_POST['new_first_name'];
$new_last_name = $_POST['new_last_name'];
$user_id = $_POST['user_id'];


$query = $mysqli->prepare('update users set first_name= ?, last_name= ? where user_id=?');
$query->bind_param('sss', $new_first_name, $new_last_name, $user_id);
if ($query->execute()) {
    $response['status'] = "info updated successfully";
} else {
    $response['status'] ="Error updating row: " . $mysqli->error;
}
echo json_encode($response);