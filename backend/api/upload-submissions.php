<?php

include('connection.php');

$user_id = $_POST['user_id'];
// $assignment_id = $_POST['assignment_id'];

$target_path = '../submissions/' .basename($_FILES['submission']['name']);
move_uploaded_file($_FILES["submission"]['tmp_name'], $target_path);

try {
    $query = $mysqli->prepare('insert into submissions (user_id, assignment_id,submission_date, file_path) values (?, 15,now(),?)');
    $query->bind_param('is', $user_id, $target_path);
    $query->execute();
    $response['status'] = "File uploaded successfully.";
} catch (Exception $e) {
    $response['status'] = "Error uploading file: " . $e->getMessage();
}
echo json_encode($response);