<?php
include('connection.php');

$email = $_POST['email'];

$query = $mysqli->prepare('select email from users where email=?');
$query->bind_param('s', $email);
$query->execute();

$query->store_result();
$query->bind_result($email);
$query->fetch();

$num_rows = $query->num_rows();
if ($num_rows == 0) {
    $response['status'] = 'this email does not exist';
} else {
    $response['status'] = 'email found';
}
echo json_encode($response);
