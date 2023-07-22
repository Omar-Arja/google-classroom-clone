<?php
include('connection.php');

$email = $_POST['email'];

$query = $mysqli->prepare('select first_name, last_name, email from users where email=?');
$query->bind_param('s', $email);
$query->execute();
$query->store_result();
$query->bind_result($first_name, $last_name, $email);
$query->fetch();

$num_rows = $query->num_rows();
if ($num_rows == 0) {
    $response['status'] = 'this email does not exist';
} else {
    $response['status'] = 'email found';
    $response['email'] = $email;
    $response['first_name'] = $first_name;
    $response['last_name'] = $last_name;
}
echo json_encode($response);
