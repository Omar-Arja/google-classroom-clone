<?php
include('connection.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
//Create an instance; passing `true` enables exceptions

$student_email = $_POST['email'];
$class_id = $_POST['class_id'];
$sender_first_name = $_POST['sender_first_name'];
$sender_last_name = $_POST['sender_last_name'];


$query = $mysqli->prepare('select user_id, first_name, last_name, email from users where email=?');
$query->bind_param('s', $student_email);
$query->execute();

$query->store_result();
$query->bind_result($user_id, $first_name, $last_name, $email);
if($query->fetch()){
    $hashed_id = password_hash($user_id, PASSWORD_BCRYPT);

    $query2 = $mysqli->prepare('select class_name, class_code from classes where class_id=?');
    $query2->bind_param('s', $class_id);
    $query2->execute();

    $query2->store_result();
    $query2->bind_result($class_name, $class_code);
    if($query2->fetch()){
        $hashed_class_code = password_hash($class_code, PASSWORD_BCRYPT);

        $invite_link = 'http://localhost/google-classroom-clone/frontend/html/index.html?user_id='. $hashed_id .'&c_code=' . $hashed_class_code;

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
        $mail->Subject = 'Classroom class invite';
        $mail->Body    = 'Dear ' .$first_name.', <br>'. $sender_first_name .' ' .$sender_last_name .' invites you to join
        the class ' .$class_name .'<br> Please use this link to join:<br>' .$invite_link .'<br> Classroom Clone Group 9';


        $mail->send();
        $response['status'] = 'Message has been sent';
            } catch (Exception $e) {
                $response['status'] = "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            }       
            } else {
                $response['status'] = "No user found with the provided email.";
            };
            echo json_encode($response);
        };

        