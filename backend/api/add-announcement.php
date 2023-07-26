<?php
include('connection.php');

if(isset($_POST['class_id']) && isset($_POST['id_user']) && isset($_POST['content'])) {
    $class_id = $_POST['class_id'];
    $user_id = $_POST['id_user'];
    $content = $_POST['content'];
   
    // get the teacher name
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

    $query02 = $mysqli->prepare('insert into streams(class_id, user_id, content, post_date,number_of_likes) values(?,?,?,Now(),0)');
    $query02->bind_param('iis', $class_id,$user_id,$content);
    $query02->execute();
    $query02->store_result();
    $response['status'] = "Success";
    $response['message'] = "stream added";
}
else {
    $response['status'] = "Error";
    $response['message'] = "Missing POST variables";
}

echo json_encode($response);
?>