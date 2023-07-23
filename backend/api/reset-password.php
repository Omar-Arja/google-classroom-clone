<?php
include('connection.php');

$email_to_reset_pass = $_POST['email'];
$new_password = $_POST['new_password'];

$token = $_POST['token'];

$query = $mysqli->prepare('select user_id, email from users where email=?');
$query->bind_param('s', $email_to_reset_pass);
$query->execute();

$query->store_result();
$query->bind_result($user_id, $email);

if($query->fetch()){
    if(password_verify($user_id, $token)){
        $query = $mysqli->prepare('update users set password = ? where email = ?');
        $hashed_new_password = password_hash($new_password, PASSWORD_BCRYPT);
        $query->bind_param('ss', $hashed_new_password, $email_to_reset_pass);

// Execute the UPDATE query
        if ($query->execute()) {
            echo "password updated successfully";
        } else {
            echo "Error updating row: " . $mysqli->error;
        }
            }

        }