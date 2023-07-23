<?php
include('connection.php');

$currentDateTime = date('M d H:i');

var_dump($_FILES);

foreach($_FILES['submission']['tmp_name'] as $key => $value) {
    move_uploaded_file($value, '../submissions/' .basename($_FILES['submission']['name'][$key]));

}