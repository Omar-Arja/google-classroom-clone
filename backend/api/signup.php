<?php
include('connection.php');


$first_name = $_POST['first_name'];
$last_name = $_POST['last_name'];
$email = $_POST['email'];
$password = $_POST['password'];


$check_email = $mysqli->prepare('select email from users where email=?');
$check_email->bind_param('s', $email);
$check_email->execute();
$check_email->store_result();
$username_exists = $check_email->num_rows();

if ($username_exists == 0) {
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    $query = $mysqli->prepare('insert into users(first_name, last_name, email, password) values(?,?,?,?)');
    $query->bind_param('ssss', $first_name, $last_name, $email, $hashed_password);
    $query->execute();
    $response['status'] = "signed up successfully";
} else {
    $response['status'] = "this email already exists";
}
echo json_encode($response);
