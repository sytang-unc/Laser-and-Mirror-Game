<?php
    //due to information by you all,  Planned simply to use db-connect to access the mysql pod,
    // then based on which button pressed [Register] [login], the conditions should occur.
	session_start();
	//require('db-connect.php');
	$host_route = getenv("MYSQL_SERVICE_HOST");
	$use = getenv("MYSQL_USER");
	$pw = getenv("MYSQL_PASSWORD");
	$db = getenv("MYSQL_DATABASE");
	$user = $_SESSION['user']; 
	$conn = new mysql('host_route', 'use', 'pw');
	if (!$conn){
	    die("Database Connection Failed" . mysqli_error($conn));
	}
   //modify to test for a existing db, this selects the database of your target
	$select_db = mysqli_select_db($conn, 'ACCOUNTS');
	if (!$select_db){
 	   die("Database Selection Failed" . mysqli_error($conn));
	}
	echo //'<div class="container">
      '<fieldset class="form-signin" method="POST">'
       . '<h2 class="form-signin-heading" name="labelUser">Login</h2>'
        .'<div class="user-input">'
        .'<label for="userName" class="userN">Username</label>'
        .'<input type="username" name="username" id="inputUserName" class="form-control" placeholder="Username" required autofocus>'
        .'</div>'
        .'<div class="passw-input">'
        .'<label for="inputPassword" class="sr-only">Password</label>'
        .'<input type="password" name="password" id="inputPassword" class="form-control" placeholder="Password" required>'
        .'</div>'
        .'<br>'
        .'<button class="btn btn-lg btn-primary btn-block" name="reg" type="submit">Register</button>'
        .'<button class="btn btn-lg btn-primary btn-block" name="log" type="submit">Login</button>'
        .'<button class="btn btn-lg btn-primary btn-block" name="logot" type="submit">Logout</button>'
      .'</fieldset>';
//</div>
    // Registration
	$username = "";
	$password = "";
    // If the values are posted, insert them into the database.
    if (isset($_POST['username']) && isset($_POST['password'] && isset($_POST['reg']))){
        $username = $_POST['username'];
        $password = $_POST['password'];
 
        $query = "INSERT INTO ACCOUNTS (username, password) VALUES ($username, $password)";
        $input = $conn->query($query);
        if($input){
            echo "New User Created Successfully";
            $user=$username; // set session to username
        }else{
            echo "User Registration Failed!";
        }
    }
    //was planning on using href="db-login.php" for login to pull up a page for the ACCOUNT screen creation foreground.... 4/15/17
    elseif (isset($_POST['username']) && isset($_POST['password'] && isset($_POST['log']))) {
 		//db-login.php........
    	$username = $_POST['username'];
        $password = $_POST['password'];
        // to select for username and password match
        $select = mysql_query("SELECT username, password FROM ACCOUNTS WHERE username= $username");
        $row = mysql_fetch_array($select); // makes the selected info as one row
        $bool = mysql_num_rows($select); // fetch row just boolean if exists.
        if($bool == 1 && $row['password']==$password){
        	// I was planning here to implement db-login.php as open to an account view around here 4/24/17
        	$_SESSION['username']= $row['username'];
        	echo "Account Exists, Successfully login as: ";
        	echo $username;
        	$user=$username;
        } else {
        	echo "Account does not exist, redo your username and/ password please";
        }
    } else {
    	if (empty($username)) {
    		echo "Please enter a username.";
    	}
    	if(empty($password)){
    		echo "Please enter a password";
    	}
    }

?>