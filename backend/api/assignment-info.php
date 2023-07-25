<?php

include('connection.php');

if (
    isset($_POST['class_id']) &&
    isset($_POST['title']) &&
    isset($_POST['description']) &&
    isset($_POST['due_date'])
) {
    $class_id = $_POST['class_id'];
    $title = $_POST['title'];
    $description = $_POST['description'];
    $due_date = $_POST['due_date'];
    $formatted_due_date = date('Y-m-d H:i:s', strtotime($due_date));

    // Check if the class_id exists in the classes table
    $check_query = $mysqli->prepare('SELECT class_id FROM classes WHERE class_id = ?');
    $check_query->bind_param('i', $class_id);
    $check_query->execute();
    $check_result = $check_query->get_result();

    if ($check_result->num_rows === 0) {
        $response["status"] = "class_id does not exist in the classes table";
    } else {
        $insert_query = $mysqli->prepare('INSERT INTO assignments (class_id, title, description, due_date) VALUES (?, ?, ?, ?)');
        $insert_query->bind_param('isss', $class_id, $title, $description, $formatted_due_date);
        if ($insert_query->execute()) {
            $response["status"] = "assignment posted successfully";
        } else {
            $response["status"] = "failed to post assignment";
        }
    }
} else {
    $response["status"] = "missing required fields";
}

echo json_encode($response);
