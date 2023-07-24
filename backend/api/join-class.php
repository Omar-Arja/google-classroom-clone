<?php

include('connection.php');




$user_id = $_POST['user_id'];
$class_code = $_POST['class_code'];
$query = $mysqli->prepare('select class_id from classes where class_code = ?');
$query->bind_param('s', $class_code);
$query->execute();
$query->store_result();
$query->bind_result($class_id);
$query->fetch();

$num_rows = $query->num_rows();

if ($num_rows == 0) {
    $response['status'] = 'class code does not exist';
}
else {
    $query = $mysqli->prepare('select * from enrollements where user_id = ? and class_id = ?');
    $query->bind_param('ii', $user_id, $class_id);
    $query->execute();
    $query->store_result();
    $query->fetch();
    $num_rows = $query->num_rows();
    if ($num_rows == 0) {
        $query = $mysqli->prepare('insert into enrollements(user_id, class_id, usertype_id) values(?,?,?)');
        $usertype_id = 2;
        $query->bind_param('iii', $user_id, $class_id, $usertype_id);
        $query->execute();
        $response['status'] = 'class joined successfully';
    }
    else {
        $response['status'] = 'user already enrolled in this class';
    }
}

echo json_encode($response);


