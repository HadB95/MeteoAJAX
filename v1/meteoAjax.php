<?php
$ville = $_POST['ville'];
$json = file_get_contents($ville.'.json');
echo $json;
?>