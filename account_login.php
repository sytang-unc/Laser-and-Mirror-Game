<?php
    //due to information by you all,  Planned simply to use db-connect to access the mysql pod,
    // then based on which button pressed [Register] [login], the conditions should occur.
	//LOG_STATE - 1 if user is logged in (otherwise not set)
	//LOG_REASON - reason for login failure (not set when no attempt to login is made)
	#LOG_REASON values
	define("CONNECT_FAIL", 2);
	define("NO_ACCOUNT", 3);
	session_start();
	//require('db-connect.php');
	// I organized the conditionals in order
	/*
	ACTION = LOGIN/REGISTER -> connect
		|-0
		-------!connected then echo die
		|-0
		------- No empty inputs?....THEN CONTINUED
		|0
		-------ACTION = REGISTER -> insert and verify if registered successful
		|	---LOG_STATE = 1
		|
		-------ACTION = LOGIN -> verify in table first by username then password
			---LOG_STATE = 1
	ACTION = LOGOUT 0->session end, start
	*/
	if ($_POST["LOG_ACTION"] == "LOGIN" || $_POST["LOG_ACTION"] == "REGISTER"){
		$_SESSION["LOG_STATE"] = 0;
		$host_route = getenv("MYSQL_SERVICE_HOST");
		$use = getenv("MYSQL_USER");
		$pw = getenv("MYSQL_PASSWORD");
		$db = getenv("MYSQL_DATABASE");
		$user = $_SESSION['user']; 
		$conn = new mysql('host_route', 'use', 'pw');
		if (!$conn){
			//die("Database Connection Failed" . mysqli_error($conn));
			$_SESSION["LOG_REASON"] = CONNECT_FAIL;
		}
		//modify to test for a existing db, this selects the database of your target
		$select_db = mysqli_select_db($conn, $db);
		if (!$select_db){
			//die("Database Selection Failed" . mysqli_error($conn));
			$_SESSION["LOG_REASON"] = CONNECT_FAIL;
		}
		$username = $_POST['username'];
        $password = $_POST['password']; 
    	if ($username)) {echo "Please enter a username.";}
    	elseif(empty($password)){echo "Please enter a password";}
    	else {
			if($_POST["LOG_ACTION"] == "REGISTER") {
				// Registration
				$age = 1; //age = ##
				$employ = 0; // 0-1 no or yes 
				$education = "";  // before high school, college, graduate school
				$authorize = 0; // 0 = common user, 1++ based on user authority level
			    // If the values are posted, insert them into the database.
	    		//if (isset($_POST['username']) && isset($_POST['password'] && isset($_POST['reg']))){
	     		$query = "INSERT INTO ACCOUNTS (username, password) VALUES ($username, $password)";
	        	$input = $conn->query($query);
	       		if($input){
	       			$_SESSION["LOG_STATE"] = 1;
	       			$user=$username; // set session to username
	           		echo "New User Created Successfully, please select you demographics below.";
	           		echo $input;
	        	    // I plan to add-user selects the demographics input here by echo a registration html set:
	        	    //basically the html used here is just selecting from a drop-list by which demographics are selected and the user input his or her level of authority
	        	    //echo <....>;
	        	    //$demographics = "INSERT INTO ACCOUNTS (age, employment, education, authority) VALUES ($age, $employ, $education, $authorize)";
	        	    //$conn->query($demographics);
	        	}else{
	        		$_SESSION["LOG_STATE"] = 0;
	            	echo "User Registration Failed!";
	            	echo $input;
	       		}
	    	}else { //if ($_POST["LOG_ACTION"] == "LOGIN") {
	       		//select for username and password match
	      		$select = mysql_query("SELECT username, password FROM ACCOUNTS WHERE username = $username");
	        	$row = mysql_fetch_array($select); // makes the selected info as one row
	       		$bool = mysql_num_rows($select); // fetch row just boolean if exists.
	        	if($bool == 1 && $row['password']==$password){
	        	//$_SESSION['username']= $row['username']; //based on what was shown in graph.php
	        		$_SESSION["LOG_STATE"] = 1;
	       		    if (isset($_SESSION["LOG_REASON"])){
	       		    	unset($_SESSION["LOG_REASON"]);
	       		    }
	        		echo "Account Exists, Successfully login as: ". $username;
	        		$user=$username;
			   	} else {
			   		$_SESSION["LOG_STATE"] = 0;
			   		$_SESSION["LOG_REASON"] = NO_ACCOUNT;
	    		   	echo "Account does not exist, redo your username and/ password please";
	   			}
	   			$conn->close();
	   		}
    	}
    } elseif($_POST["LOG_ACTION"] == "LOGOUT"){
 		session_destroy();
 		session_start();
	}
?>
<!DOCTYPE html>
<html>
  <head>
    <title>Board</title>
    <script src="http://www.cs.unc.edu/Courses/comp426-f16/jquery-3.1.0.js" type="text/javascript"></script>
    <link rel="stylesheet" href="css/board.css" />
    <script type="text/javascript" src="fusioncharts/js/fusioncharts.js"></script>
    <script type="text/javascript" src="fusioncharts/js/themes/fusioncharts.theme.ocean.js"></script>
  </head>
  <body>
    <div id="container">
      <div id="header">
        Mirror Logic Puzzle
      </div>
      <div id="menu">
        <table>
          <tr>
            <td id="gametab" style="cursor: default;" onClick="location.href='board.html'">
              GAME
            </td>
            <td id="logintab" style="border-bottom: 0px; cursor: default;" onClick="window.location.reload()">
              LOGIN
            </td>
            <td id="statstab" style="cursor: default;" onClick="location.href='stats.html'">
              STATS
            </td>
          </tr>
        </table>
      </div>
      <div id="window" style="display:block">
        <?php
        	if ($_SESSION["LOG_STATE"]){
        		echo '<b>Welcome ' . $_SESSION[user] . '</b>'
        			. '<form method="post">'
        			. '<input type="hidden" name="LOG_ACTION" value="LOGOUT">'
        			. '<input type="submit" value="LOGOUT">'
        			. '</form>';
        	}
        	else{
        		switch ($_SESSION["LOG_REASON"]){
        			case CONNECT_FAIL:
        				echo '<b>Login failed due to failed MySQL connection</b><br>';
        				break;
        			case NO_ACCOUNT:
        				echo '<b>Given username and password not recognized</b><br>';
        				break;
        			default:
        				echo '<div style="font-weight:bold;">Login/Sign-up:</div><br/>';
        		}
            echo /*'<table style="border-collapse: collapse; padding: 0;">'
        			 . '<tr>
        			 		<td style="width: 85px;">Username: </td>
        			 		<td><input type="text" name="username" id="inputUserName" class="form-control" placeholder="Username" required autofocus></td>
        			 	</tr>'
        			 . '<tr><td>Password: </td><td><input type="text" name="password" id="inputPassword" class="form-control" placeholder="Password" required autofocus></td></tr>'
               . '</table>'
          		 . '<input type="submit" name="reg" value="Register">'
        			 . '<input type="hidden" name="LOG_ACTION" value="REGISTER">'
        		 . '<input type="submit" name="log" value="Log In">'
        			 . '<input type="hidden" name="LOG_ACTION" value="LOGIN">'
        		 . '<input type="submit" name="logot" value="Log Out">'
        			 . '<input type="hidden" name="LOG_ACTION" value="LOGOUT">';
        			 */
   //    		echo //'<div class="container">
        		'<form method = "POST" action="/account_login.php">'
        		.'<fieldset class="form-signin" method="POST">'
        		//. '<h2 class="form-signin-heading" name="labelUser">Login</h2>'
        		.' Username: <input type="text" name="username" id="inputUserName" class="form-control" placeholder="Username" required autofocus>'
        		.' Password: <input type="text" name="password" id="inputPassword" class="form-control" placeholder="Password" required autofocus>'
        		.'<input type="submit" name="reg" value="Register">'
        			. '<input type="hidden" name="LOG_ACTION" value="REGISTER">'
        		. '<input type="submit" name="log" value="Log In">'
        			. '<input type="hidden" name="LOG_ACTION" value="LOGIN">'
        		. '<input type="submit" name="logot" value="Log Out">'
        			. '<input type="hidden" name="LOG_ACTION" value="LOGOUT">'
        		.'</fieldset>'
        		.'</form>';
  			}
        ?>

      </div>
      <div id="footer">
        Ram Neta, UNC Department of Philosophy
      </div>
    </div>
  </body>
</html>