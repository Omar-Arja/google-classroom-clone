<?php
include('connection.php');

$id_user = $_POST['id_user'];
$class_code = $_POST['class'];
$confirm_enrollement_link = 'http://localhost/SEF/google-classroom-clone/index.html?id_user='.$id_user.'&class='.$class_code;

// 1- check if the email exists
$query = $mysqli->prepare('select first_name, last_name,email
                           from users 
                           where user_id=?');
$query->bind_param('i', $id_user);
$query->execute();

$query->store_result();
$query->bind_result($student_first_name,$student_last_name,$student_email);
$query->fetch();
$num_rows = $query->num_rows();
if ($num_rows == 0) {
    $response['status'] = 'this email does not exist';
} else {
    
    
    // 2- get the teacher name and the class name

    $query2 = $mysqli->prepare('SELECT users.first_name, users.last_name, classes.class_name
                            FROM users
                            JOIN classes ON users.user_id = classes.user_id
                            WHERE classes.class_code = ?');
    $query2->bind_param('s', $class_code);
    $query2->execute();
    $query2->store_result();
    $query2->bind_result($teacher_first_name, $teacher_last_name, $class_name);
    $query2->fetch();

    if ($num_rows == 0) {
        $response['status'] = 'this class code does not exist';
    }
    else{
        //3 - send email invitation 
        $to = $student_email; // the recipient email address
        $subject = "Class invitation: ".$class_name." (".$teacher_first_name." ".$teacher_last_name.")" ; // Replace with the subject of the email
        $message = "Dear ".$student_first_name." ".$student_last_name.",\n\nYou have been invited to join our Class ".$class_name.". Please click on the following link to join our course:\n\n".$confirm_enrollement_link."\n\nThank you,\nSEF Team"; 
        $headers = "From: zeinahassan.a22@gmail.com"; // Replace with the sender email address
        $response['status'] = $message;
    }
    
    
           
    // // Send the email
    // if(mail($to, $subject, $message, $headers)) {
    //     $response['status'] = "Invitation email sent successfully";
    // } else {
    //     $response['status'] = "Unable to send invitation email";
    // }
}
echo json_encode($response);
?>