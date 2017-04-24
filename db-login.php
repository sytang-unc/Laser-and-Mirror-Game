<?php
	require('db-connect.php');
    // If the values are posted, select them from the database.

    /*if (isset($_POST['username']) && isset($_POST['password'])){
        $username = $_POST['username'];
        $password = $_POST['password'];
 
        $query = "SELECT username FROM 'ACCOUNTS' WHERE username=$username, password=$password";
        $input = mysqli_fetch($conn, $query);
        if($input){
            echo "User Exists";
        }else{
            echo "Not a User, Please Register";
        }
    }*/
    //4/24/17
    if (isset($_POST['username']) && isset($_POST['password'])){
        $username = $_POST['username'];
        $password = $_POST['password'];
 
        $query = "SELECT username FROM 'ACCOUNTS' WHERE username=$username, password=$password";
        $input = mysqli_fetch($conn, $query);
    }
?>