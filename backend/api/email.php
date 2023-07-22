<?php
include('connection.php');

$email = $_POST['email'];

$query = $mysqli->prepare('select user_id, first_name, last_name, email, role
from users 
where email=?');
$query->bind_param('s', $email);
$query->execute();

$query->store_result();
$query->bind_result($user_id, $first_name, $last_name, $email, $role);
$query->fetch();

$num_rows = $query->num_rows();
if ($num_rows == 0) {
    $response['status'] = "this email does not exist";
} else {
    $response['status'] = 'logged in';
    $response['user_id'] = $user_id;
    $response['first_name'] = $first_name;
    $response['last_name'] = $last_name;
    $response['role'] = $role;
}
echo json_encode($response);
