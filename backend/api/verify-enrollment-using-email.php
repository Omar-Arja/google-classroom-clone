<?php

include('connection.php');


$invited_student_id = $_POST['invited_student_id'];
$signed_in_id = $_POST['signed_in_id'];

if (password_verify($signed_in_id, $invited_student_id)) {
    $response['status'] = 'id verified';
} else {
    $response['status'] = 'id not verified';
}
echo json_encode($response);