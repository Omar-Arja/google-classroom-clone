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

function generateCode() {
    $characters = '0123456789';
    $charactersLength = strlen($characters);
    $token = '';
    for ($i = 0; $i < 6; $i++) {
        $token .= $characters[rand(0, $charactersLength - 1)];
    }
    return $token;
}


$student_email = $_POST['email'];

$query = $mysqli->prepare('select user_id, first_name from users where email=?');
$query->bind_param('s', $student_email);
$query->execute();

$query->store_result();
$query->bind_result($user_id, $first_name);

if($query->fetch()){
    $token = generateCode();
    $expiry = time() + 3600;
    $reset_link = 'http://localhost/google-classroom-clone/frontend/html/passwordreset.html?tkn='. $token;

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
    $mail->Body    = 'Dear ' .$first_name .', <br>To reset your password please use the link below:<br>' .$reset_link .'<br>Group 9';


    if($mail->send()){
        $query2 = $mysqli->prepare('insert into token(user_id,token, expiry) values(?,?,?)');
        $query2->bind_param('iii', $user_id,$token, $expiry);
        $query2->execute();
    }
    
        } catch (Exception $e) {
            $response['status'] = "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}       
} else {
    $response['status'] = "No user found with the provided email.";
};

echo json_encode($response);

// ?>