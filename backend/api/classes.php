<?php

include('connection.php');

// map role to usertype_id
$roleMapping = array(
    1 => "teacher",
    2 => "student"
);


if (isset($_POST['user_id'])) {
    $user_id = $_POST['user_id'];
    $query = $mysqli->prepare('select class_id, class_name, class_section, class_subject, class_room, total_number_students, class_code, usertype_id 
    from classes
    where user_id = ?');
    $query->bind_param('i', $user_id);
    $query->execute();
    $query->store_result();
    $query->bind_result($class_id, $class_name, $class_section, $class_subject, $class_room, $total_number_students, $class_code, $usertype_id);
    $classes = array();

    while ($query->fetch()) {
        $class = array(
            'class_id' => $class_id,
            'class_name' => $class_name,
            'class_section' => $class_section,
            'class_subject' => $class_subject,
            'class_room' => $class_room,
            'total_number_students' => $total_number_students,
            'class_code' => $class_code,
            'role' => $roleMapping[$usertype_id]
        );
        $classes[] = $class;
    }

    $enrollment_query = $mysqli->prepare('select c.class_id, c.class_name, c.class_section, c.class_subject, c.class_room, c.total_number_students, e.usertype_id
    from classes c
    inner join enrollements e ON c.class_id = e.class_id
    where e.user_id = ?');
    $enrollment_query->bind_param('i', $user_id);
    $enrollment_query->execute();
    $enrollment_query->store_result();
    $enrollment_query->bind_result($class_id, $class_name, $class_section, $class_subject, $class_room, $total_number_students, $usertype_id);
    while ($enrollment_query->fetch()) {
        $enrolled_class = array(
            'class_id' => $class_id,
            'class_name' => $class_name,
            'class_section' => $class_section,
            'class_subject' => $class_subject,
            'class_room' => $class_room,
            'total_number_students' => $total_number_students,
            'role' => $roleMapping[$usertype_id]
        );
        $classes[] = $enrolled_class;
    }
    
    echo json_encode($classes);

} else {
    $response['status'] = "Error";
    $response['message'] = "User ID not set";
    echo json_encode($response);
}