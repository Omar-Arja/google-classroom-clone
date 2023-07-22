<?php
include('connection.php');

if($_POST){
    $response['post'] = 1;
    // approve enrollment by code
    $id_user = $_POST['id_user'];
    $class_code = $_POST['class_code'];  
}
else{
    // approve enrollment by email
    $response['get'] = 1;
    $id_user = $_GET['id_user'];
    $class_code = $_GET['class_code'];
}

// check if the user exists
$query1 = $mysqli->prepare('SELECT users.user_id
                           FROM users
                           WHERE user_id=?');
$query1->bind_param('i',$id_user);
$query1->execute();

$query1->store_result();
$query1->bind_result($user_id);
$query1->fetch();
$num_rows = $query1->num_rows();

if ($num_rows == 0) {
    $response['status'] = 'the user does not exist';
    } 
else {
    // 2- check the class code 
    $query2 = $mysqli->prepare('SELECT class_id
                               FROM classes
                               WHERE classes.class_code = ?');
    $query2->bind_param('s',$class_code);
    $query2->execute();
    $query2->store_result();
    $query2->bind_result($class_id);
    $query2->fetch();
    $num_rows = $query2->num_rows();
    if ($num_rows == 0) {
     $response['status'] = 'class code not found';
    }
    else{

        // 3- check if the user is already enrolled
       
        $query4 = $mysqli->prepare('SELECT student_id
                                    FROM enrollements
                                    WHERE enrollements.class_id= ?
                                    and student_id =?');
        if (!$query4) {
            // Query preparation failed; print error message
            echo "Query preparation failed: " . mysqli_error($mysqli);
        } 
        $query4->bind_param('si',$class_id,$id_user);
        
        $query4->execute();
        $query4->store_result();
        $query4->bind_result($class_id);
        $query4->fetch();
        $num_rows = $query4->num_rows;
        if ($num_rows > 0) {
         $response['status'] = 'user already enrolled to this class';
        }
        else{
        // 3- enroll the user
        $date_now = date("Y-m-d H:i:s");
        $query3= $mysqli->prepare('insert into enrollements(student_id, class_id, enrollement_date) values(?,?,?)');
        $query3->bind_param('iss',$id_user,$class_id,$date_now);
        $query3->execute();
        $response['status'] = 'user enrolled';
    }
    }

    
}

echo json_encode($response);


?>