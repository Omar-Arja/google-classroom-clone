<?php
include('connection.php');

$currentDateTime = date('M d H:i');
$datetimeObject = DateTime::createFromFormat('M d H:i', $currentDateTime);

$formattedDateTime = $datetimeObject->format('Y-m-d H:i:s');
var_dump($_FILES);


foreach($_FILES['submissions']['tmp_name'] as $key => $value) {
    $file_path = '../submissions/' .basename($_FILES['submissions']['name'][$key]);
    move_uploaded_file($value, $file_path);
    // $user_id_param = $user_id;
    $formattedDateTime_param = $formattedDateTime;
    $file_path_param = $file_path;
    try {

        $query = $mysqli->prepare('insert into submissions (user_id, submission_date, file_path) values (?,?,?)');
        $query->bind_param('sss', '7', $formattedDateTime_param, $file_path_param);
        $query->execute();
        echo "File inserted successfully.<br>";
    } catch (Exception $e) {
        echo "Error inserting file: " . $e->getMessage() . "<br>";
    }

    
}