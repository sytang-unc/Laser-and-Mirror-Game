<?php
	require('db-connect.php');
    // If the values are posted, insert them into the database.
    if (isset($_POST['username']) && isset($_POST['password'])){
        $username = $_POST['username'];
        $password = $_POST['password'];
 
        $query = "INSERT INTO `ACCOUNTS` (username, password) VALUES ('$username', '$password')";
        $input = mysqli_query($conn, $query);
        if($input){
            echo "New User Created Successfully";
        }else{
            echo "User Registration Failed";
        }
    }
?>
<!DOCTYPE html>
<html>
<head>
	<title>Mirror---AccountLogin</title>
</head>
<body>
<div class="container">
      <form class="form-signin" method="POST">
        <h2 class="form-signin-heading">Login</h2>
        <div class="user-input">
        <label for="userName" class="userN">Username</label>
        <input type="username" name="username" id="inputUserName" class="form-control" placeholder="Username" required autofocus>
        </div>
        <div class="passw-input">
        <label for="inputPassword" class="sr-only">Password</label>
        <input type="password" name="password" id="inputPassword" class="form-control" placeholder="Password" required>
        </div>
        <br>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
        <button class="btn btn-lg btn-primary btn-block" href="db-login.php">Login</button>
      </form>
</div>
</body>
</html>