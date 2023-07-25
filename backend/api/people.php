<?php

include('connection.php');

// map role to usertype_id
$roleMapping = array(
    1 => "teacher",
    2 => "student"
);


$class_id = $_POST['class_id'];

$query = $mysqli->prepare('select user_id, usertype_id from enrollements where class_id = ? union select user_id, usertype_id from classes where class_id = ?');
$query->bind_param('ii', $class_id, $class_id);
$query->execute();
$query->store_result();
$query->bind_result($user_id, $usertype_id);

$users = array();

while ($query->fetch()) {
    $query2 = $mysqli->prepare('select first_name, last_name from users where user_id = ?');
    $query2->bind_param('i', $user_id);
    $query2->execute();
    $query2->store_result();
    $query2->bind_result($first_name, $last_name);
    $query2->fetch();
    $users[] = array(
        'first_name' => $first_name,
        'last_name' => $last_name,
        'role' => $roleMapping[$usertype_id]
    );
}

echo json_encode($users);