<?php
//LOG_STATE - 1 if user is logged in (otherwise not set)
//LOG_REASON - reason for login failure (not set when no attempt to login is made)
#LOG_REASON values for CONNECT or FAIL
define("CONNECT_FAIL", 2);
define("NO_ACCOUNT", 3);
session_start();

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
	$conn = new mysqli($host_route, $use, $pw, $db);
	if (!$conn){
		$_SESSION["LOG_REASON"] = CONNECT_FAIL;
	}
	
	$username = $_POST['username'];
	$password = $_POST['password']; 

	if (empty($username)) {echo "Please enter a username.";}
	elseif (empty($password)){echo "Please enter a password";}
	else {
		if($_POST["LOG_ACTION"] == "REGISTER") {
			// Registration
			$age = 1; //age = ##
			$employ = 0; // 0-1 no or yes 
			$education = "";  // before high school, college, graduate school
			$authorize = 0; // 0 = common user, 1++ based on user authority level
		    // If the username and password  are posted, insert them into the database.
     		$query = $conn->prepare("INSERT INTO ACCOUNTS (username, password) VALUES (?, ?)");
        	$query->bind_param("ss", $username, $password);
        	$query->execute();
        	if($query){
       			$_SESSION["LOG_STATE"] = 1;
       			$_SESSION['user']=$username; // set session to username
           		echo "New User Created Successfully, please select you demographics below.";
        	    // I plan to add-user selects the demographics input here by echo a registration html set:
        	    //basically the html used here is just selecting from a drop-list by which demographics are selected and the user input his or her level of authority
        	    //echo <....>;
        	    //$demographics = "INSERT INTO ACCOUNTS (age, employment, education, authority) VALUES (?, ? ?, ?)";
        	    //$conn->prepare($demographics);
        	}
        	else{
        		$_SESSION["LOG_STATE"] = 0;
	            echo "User Registration Failed!";
	       	}
		}
		else { 
	    	//LOGIN: select for username and password match
	    	$select = $conn->prepare("SELECT username FROM ACCOUNTS WHERE username=? AND password=?");
	    	$select->bind_param("ss", $username, $password);
	    	$select->execute();
	    	if($select->get_result()->num_rows != 0){
	        	$_SESSION["LOG_STATE"] = 1;
       			if (isset($_SESSION["LOG_REASON"])){
       			    unset($_SESSION["LOG_REASON"]);
   			    }
        		echo "Account Exists, Successfully login as: ". $username;
        		$_SESSION['user']=$username;
			}
			else {
		   		$_SESSION["LOG_STATE"] = 0;
		   		$_SESSION["LOG_REASON"] = NO_ACCOUNT;
    			echo "Account does not exist, redo your username and/ password please";
   			}
   			$select->close();
   			$conn->close();
   		}
	}
}
//If already logged in, can log out of account
elseif ($_POST["LOG_ACTION"] == "LOGOUT"){
	session_destroy();
	session_start();
	echo "Successfully logged out!";
	unset($_SESSION["user"]);
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
	<?php
	if (isset($_SESSION['user'])){
		echo 'Mirror Logic Puzzle (' . $_SESSION['user'] . ')';
	}
	else{
		echo 'Mirror Logic Puzzle';
    }
    ?>
      </div>
      <div id="menu">
        <table>
          <tr>
            <td id="gametab" style="cursor: default;" onClick="location.href='index.php'">
              GAME
            </td>
            <td id="logintab" style="border-bottom: 0px; cursor: default;" onClick="window.location.reload()">
              LOGIN
            </td>
            <td id="statstab" style="cursor: default;" onClick="location.href='stats.php'">
              STATS
            </td>
          </tr>
        </table>
      </div>
      <div id="window" style="display:block">
        <?php
        	if ($_SESSION["LOG_STATE"]){
        		echo '<b>Welcome! ' . $_SESSION['user'] . '</b>'
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
            echo '<form method = "POST" action="/login.php">'
        		.'<fieldset class="form-signin" method="POST">'
        		.' Username: <input type="text" name="username" id="inputUserName" class="form-control" placeholder="Username" required autofocus>'
        		.' Password: <input type="password" name="password" id="inputPassword" class="form-control" placeholder="Password" required autofocus>'
        			.'<input type="submit" name="LOG_ACTION" value="REGISTER">'
        			. '<input type="submit" name="LOG_ACTION" value="LOGIN">'
        			. '<input type="submit" name="LOG_ACTION" value="LOGOUT">'
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
