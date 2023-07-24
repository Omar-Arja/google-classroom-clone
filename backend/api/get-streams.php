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
$i = 0;
while($query->fetch()){
    $response[$i]['stream_id'] = $stream_id;
    $response[$i]['content'] = $content;
    $response[$i]['post_date'] = $post_date;
    $i++;
 }
 echo json_encode($response);

?>