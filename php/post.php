<?php
header("Access-Control-Allow-Origin: *");
try {
  $db_host = 'localhost';
  $db_name = 'oil';
  $db_user = 'oil';
  $user_pw = '4tGkEzZ1civbaHlE'; 
  $con = new PDO('mysql:host=' . $db_host . '; dbname=' . $db_name, $db_user, $user_pw);
  $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $con->exec('SET CHARACTER SET utf8');
  $stmt = $con->prepare("INSERT INTO score_data (`score`, `nickname`) VALUES (:score, :nickname)");
  $stmt->bindParam(':score', $score);
  $stmt->bindParam(':nickname', $nickname);
  $score = $_POST['score'];
  $nickname = $_POST['nickname'];
  $stmt->execute();
}
catch (PDOException $err) {
  // echo "harmless error message if the connection fails";
  // echo $err->getMessage() . "<br/>";
  die();  //  terminate connection
}
?>