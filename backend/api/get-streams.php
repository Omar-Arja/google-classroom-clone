<?php
include('connection.php');

$class_id = $_GET['id_class'];

$query = $mysqli->prepare('SELECT streams.stream_id, streams.class_id, streams.user_id,streams.content,streams.post_date,streams.number_of_likes,users.first_name,users.last_name	
                           FROM streams INNER JOIN users
                           ON streams.user_id = users.user_id
                           WHERE class_id=?
                           ORDER BY stream_id DESC');
$query->bind_param('i', $class_id);
$query->execute();

$query->store_result();
$query->bind_result($stream_id, $class_id, $user_id,$content,$post_date,$number_of_likes,$first_name,$last_name);

while($query->fetch()){
    $stream1 = array(
        'stream_id' => $stream_id,
        'content' => $content,
        'post_date' => $post_date,
        'teacher_name' => $first_name." ".$last_name
         );
    $streams[] = $stream1;
       
 }
 
 echo json_encode($streams);

?>