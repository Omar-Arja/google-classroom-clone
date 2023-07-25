<?php
include('connection.php');

if(isset($_POST['class_id']) && isset($_POST['id_user']) && isset($_POST['title']) && isset($_POST['description']) && isset($_POST['due_date'])) {
    $class_id = $_POST['class_id'];
    $user_id = $_POST['id_user'];
    $title = $_POST['title'];
    $description = $_POST['description'];
    $due_date = $_POST['due_date'];

    // 1- get the teacher name
    $query = $mysqli->prepare('SELECT users.first_name,users.last_name	
                               FROM users
                               WHERE user_id=?
                               ');
    $query->bind_param('i', $user_id);
    $query->execute();

    $query->store_result();
    $query->bind_result($first_name, $last_name);
    if($query->fetch()){
        $stream_content = $first_name.' '.$last_name;
    }
    // 2- add assignment
    $query01 = $mysqli->prepare('insert into assignments(class_id, title, description, due_date) values(?,?,?,?)');
    $query01->bind_param('isss', $class_id,$title,$description,$due_date);
    $query01->execute();
    $assignment_id = $query01->insert_id;
    // $query01->store_result();
    if($query01->error) {
        $response['status'] = "Error";
        $response['message'] = "Error adding assignments: " . $query01->error;
    }
    else{
        $stream_content .= ' posted a new assignment: '.$title.': '.$title;

        // 3- add stream
        $query02 = $mysqli->prepare('insert into streams(class_id, user_id, content, post_date,number_of_likes, assignment_id) values(?,?,?,now(),0,?)');
        $query02->bind_param('issi', $class_id,$user_id,$stream_content, $assignment_id);
        $query02->execute();
        // $query02->store_result();

        if($query02->error) {
            $response['status'] = "Error";
            $response['message'] = "Error adding streams: " . $query02->error;
        }
        else{
            $response['status'] = "Success";
            $response['message'] = "Assignment added";
        }
    }
}
else {
    $response['status'] = "Error";
    $response['message'] = "Missing POST variables";
}

echo json_encode($response);
?>