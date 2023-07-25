<?php

include('connection.php');

if(isset($_POST['class_id'])){
    $class_id = $_POST['class_id'];
    $query = $mysqli->prepare('select assignment_id, title, description, due_date from assignments where class_id=?');
    $query->bind_param('i', $class_id);
    $query->execute();
    $query->store_result();
    $query->bind_result($assignment_id, $title, $description, $due_date);
    $assignments = array();

    while ($query->fetch()) {
        $assignment = array(
            'assignment_id' => $assignment_id,
            'title' => $title,
            'description' => $description,
            'due_date' => $due_date,
        );
        $assignments[] = $assignment;
    }
    echo json_encode($assignments);

    } else {
    $response['status'] = "Error";
    $response['message'] = "error loading assignments";
    echo json_encode($response);
    }
