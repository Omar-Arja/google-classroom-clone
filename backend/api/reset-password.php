<?php
include('connection.php');

$email_to_reset_pass = $_POST['email'];
$new_password = $_POST['new_password'];

$token = $_POST['token'];

$query = $mysqli->prepare('select user_id from users where email=?');
$query->bind_param('s', $email_to_reset_pass);
$query->execute();

$query->store_result();
$query->bind_result($user_id);

if($query->fetch()){
    $query2 = $mysqli->prepare('select user_id, expiry from tokens where token = ?');
    $query2->bind_param('i', $token);
    $query2->execute();
    $query2->store_result();
    $query2->bind_result($user_id, $expiry);
    
    if ($user_id) {
        $time_now = time();
        if ($time_now > $expiry){
            $query3 = $mysqli->prepare('update users set password = ? where email = ?');
            $hashed_new_password = password_hash($new_password, PASSWORD_BCRYPT);
            $query3->bind_param('ss', $hashed_new_password, $email_to_reset_pass);
            
                if ($query3->execute()) {
                    $response['status'] = "password updated successfully";
                } else {
                    $response['status'] =  "Error updating password: " . $mysqli->error;
                }
            }
        $query4 = $mysqli->prepare('delete from tokens where user_id = ?');
        $query4->bind_param('i', $user_id);
        $query4->execute();
            } else {
                $response['status'] = 'invalid token.';
            }
        }
    

echo json_encode($response);