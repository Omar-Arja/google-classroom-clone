<?php
include('connection.php');

$class_id = $_GET['id_class'];

$query = $mysqli->prepare('SELECT stream_id, class_id, user_id,content,post_date,number_of_likes	
                           FROM streams
                           WHERE class_id=?
                           ORDER BY stream_id DESC');
$query->bind_param('i', $class_id);
$query->execute();

$query->store_result();
$query->bind_result($stream_id, $class_id, $user_id,$content,$post_date,$number_of_likes);

while($query->fetch()){
    $stream1 = array(
        'stream_id' => $stream_id,
        'content' => $content,
        'post_date' => $post_date
         );
    $streams[] = $stream1;
       
 }
 echo json_encode($streams);

?>