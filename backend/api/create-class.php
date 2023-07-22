<?php
include('connection.php');


function generateCode() {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $code = '';
    for ($i = 0; $i < 7; $i++) {
        $code .= $characters[rand(0, $charactersLength - 1)];
    }
    echo $code;
}

if (isset($_POST['user_id']) && isset($_POST['class_name']) && isset($_POST['class_section']) && isset($_POST['class_subject']) && isset($_POST['class_room'])) {
    $user_id = $_POST['user_id'];
    $usertype_id = 1;
    $class_name = $_POST['class_name'];
    $class_section = $_POST['class_section'];
    $class_subject = $_POST['class_subject'];
    $class_room = $_POST['class_room'];
    $class_code = generateCode();
    $query = $mysqli->prepare('insert into classes(user_id, class_name, class_section, class_subject, class_room, class_code, usertype_id) values(?,?,?,?,?,?,?)');
    $query->bind_param('isssssi', $user_id, $class_name, $class_section, $class_subject, $class_room, $class_code, $usertype_id);
    $query->execute();
    $response['status'] = "class created successfully";
} else {
    $response['status'] = "Error";
    $response['message'] = "User ID not set";
}