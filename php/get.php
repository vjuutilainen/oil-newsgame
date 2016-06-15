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
  $rows = array();
  $stmt = $con->prepare("SELECT score, nickname FROM score_data WHERE 1 ORDER BY score DESC LIMIT 5");

  $stmt->execute();
  if ($stmt->rowCount() > 0) {
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $value => $row) {
      $rows[] = $row;
    }
  }
  echo json_encode($rows);
}
catch (PDOException $err) {  
  // echo "harmless error message if the connection fails";
  // $err->getMessage() . "<br/>";
  die();  //  terminate connection
}
?>