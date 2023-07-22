<?php

include('connection.php');


if (isset($_POST['user_id'])) {
    $user_id = $_POST['user_id'];
    $query = $mysqli->prepare('select class_id, class_name, class_section, class_subject, class_room, total_number_students, class_code 
    from classes
    where user_id = ?');
    $query->bind_param('i', $user_id);
    $query->execute();
    $query->store_result();
    
    $query->bind_result($class_id, $class_name, $class_section, $class_subject, $class_room, $total_number_students, $class_code);
    $classes = array();

    while ($row = $query->fetch()) {
        $class = array(
            'class_id' => $class_id,
            'class_name' => $class_name,
            'class_section' => $class_section,
            'class_subject' => $class_subject,
            'class_room' => $class_room,
            'total_number_students' => $total_number_students,
            'class_code' => $class_code
        );
        $classes[] = $class;
    }
    
    echo json_encode($classes);

} else {
    $response['status'] = "Error";
    $response['message'] = "User ID not set";
}