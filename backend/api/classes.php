<?php

include('connection.php');

// map role to usertype_id
$roleMapping = array(
    1 => "teacher",
    2 => "student"
);


// get all classes created by a user
if (isset($_POST['user_id'])) {
    $user_id = $_POST['user_id'];
    $query = $mysqli->prepare('select class_id, class_name, class_section, class_subject, class_room, total_number_students, class_code, meet_link, usertype_id 
    from classes
    where user_id = ?');
    $query->bind_param('i', $user_id);
    $query->execute();
    $query->store_result();
    $query->bind_result($class_id, $class_name, $class_section, $class_subject, $class_room, $total_number_students, $class_code, $meet_link, $usertype_id);
    $classes = array();

    while ($query->fetch()) {

        // calculate the total number of students in class
        $enrollment_query = $mysqli->prepare('select count(*) from enrollements where class_id = ? and usertype_id = 2');
        $enrollment_query->bind_param('i', $class_id);
        $enrollment_query->execute();
        $enrollment_query->store_result();
        $enrollment_query->bind_result($total_students);
        $enrollment_query->fetch();

        // update the total number of students in the class
        $update_total_query = $mysqli->prepare('update classes set total_number_students = ? where class_id = ?');
        $update_total_query->bind_param('ii', $total_students, $class_id);
        $update_total_query->execute();


        // get the updated total number of students in the class
        $total_number_students = $total_students;
        
        $class = array(
            'class_id' => $class_id,
            'class_name' => $class_name,
            'class_section' => $class_section,
            'class_subject' => $class_subject,
            'class_room' => $class_room,
            'total_number_students' => $total_number_students,
            'class_code' => $class_code,
            'meet_link' => $meet_link,
            'role' => $roleMapping[$usertype_id]
        );
        $classes[] = $class;
    }

    // get all classes enrolled by a user
    $enrollment_query = $mysqli->prepare('select c.class_id, c.class_name, c.class_section, c.class_subject, c.class_room, c.total_number_students, c.meet_link, e.usertype_id
    from classes c
    inner join enrollements e ON c.class_id = e.class_id
    where e.user_id = ?');
    $enrollment_query->bind_param('i', $user_id);
    $enrollment_query->execute();
    $enrollment_query->store_result();
    $enrollment_query->bind_result($class_id, $class_name, $class_section, $class_subject, $class_room, $total_number_students, $meet_link, $usertype_id);
    while ($enrollment_query->fetch()) {
        $enrolled_class = array(
            'class_id' => $class_id,
            'class_name' => $class_name,
            'class_section' => $class_section,
            'class_subject' => $class_subject,
            'class_room' => $class_room,
            'total_number_students' => $total_number_students,
            'meet_link' => $meet_link,
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