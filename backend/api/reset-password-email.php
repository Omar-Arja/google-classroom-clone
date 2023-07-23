<?php
include('connection.php');

// $confirm_enrollement_link = 'http://localhost/SEF/google-classroom-clone/index.html?id_user='.$id_user.'&class='.$class_code;

// // 1- check if the email exists
// $query = $mysqli->prepare('select first_name, last_name,email
//                            from users 
//                            where user_id=?');
// $query->bind_param('i', $id_user);
// $query->execute();

// $query->store_result();
// $query->bind_result($student_first_name,$student_last_name,$student_email);
// $query->fetch();
// $num_rows = $query->num_rows();
// if ($num_rows == 0) {
//     $response['status'] = 'this email does not exist';
// } else {
    
    
//     // 2- get the teacher name and the class name

//     $query2 = $mysqli->prepare('SELECT users.first_name, users.last_name, classes.class_name
//                             FROM users
//                             JOIN classes ON users.user_id = classes.user_id
//                             WHERE classes.class_code = ?');
//     $query2->bind_param('s', $class_code);
//     $query2->execute();
//     $query2->store_result();
//     $query2->bind_result($teacher_first_name, $teacher_last_name, $class_name);
//     $query2->fetch();

//     if ($num_rows == 0) {
//         $response['status'] = 'this class code does not exist';
//     }
//     else{
//         //3 - send email invitation 
//         $to = $student_email; // the recipient email address
//         $subject = "Class invitation: ".$class_name." (".$teacher_first_name." ".$teacher_last_name.")" ; // Replace with the subject of the email
//         $message = "Dear ".$student_first_name." ".$student_last_name.",\n\nYou have been invited to join our Class ".$class_name.". Please click on the following link to join our course:\n\n".$confirm_enrollement_link."\n\nThank you,\nSEF Team"; 
//         $headers = "From: zeinahassan.a22@gmail.com"; // Replace with the sender email address
//         $response['status'] = $message;
//     }
    
    
           
//     // // Send the email
//     // if(mail($to, $subject, $message, $headers)) {
//     //     $response['status'] = "Invitation email sent successfully";
//     // } else {
//     //     $response['status'] = "Unable to send invitation email";
//     // }
// }
// echo json_encode($response);

//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
//Create an instance; passing `true` enables exceptions

$student_email = $_POST['email'];

$query = $mysqli->prepare('select user_id, first_name, last_name, email from users where email=?');
$query->bind_param('s', $student_email);
$query->execute();

$query->store_result();
$query->bind_result($user_id, $first_name, $last_name, $email);
if($query->fetch()){
    $hashed_id = password_hash($user_id, PASSWORD_BCRYPT);
    $reset_link = 'http://localhost/google-classroom-clone/html/passwordreset.htmlindex.html?user_id='. $hashed_id;

    $mail = new PHPMailer(true);

    try {
    //Server settings                    //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;  
    $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'classroomclone@gmail.com';                     //SMTP username
    $mail->Password   = 'iyqdhgrmrnetaape';                               //SMTP password
    $mail->SMTPSecure = 'ssl';            //Enable implicit TLS encryption
    $mail->Port       = 465;                                     //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
    
    //Recipients
    $mail->setFrom('classroomclone@gmail.com', 'classroom clone');
    $mail->addAddress($student_email);     //Add a recipient

    // //Attachments
    // $mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
    // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = 'Classroom password reset';
    $mail->Body    = 'Dear' .$first_name .', <br>To reset your password please use the link below:<br>' .$reset_link .'<br>Group 7';


    $mail->send();
    echo 'Message has been sent';
        } catch (Exception $e) {
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}       
} else {
    echo "No user found with the provided email.";
};

// echo $reset_link;
// $reset_link = 'http://localhost/google-classroom-clone/html/passwordreset.htmlindex.html?id_user='.$user_id;

    // $response['status'] = 'logged in';
    // $response['user_id'] = $user_id;
    // $response['first_name'] = $first_name;
    // $response['last_name'] = $last_name;
    // $response['email'] = $email;



// ?>