<?php

// Alpha version!!!

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
	include_once 'BuildManager.php';

	$isMinifyJs = isset($_POST['minifyJS']) ? true : false;
	$buildManager = new BuildManager($_POST['subRoot'], $isMinifyJs);
	$buildManager->launch();
	$sms = $buildManager->getMessage();
}

?>

<h1>Build Manager</h1>
<form method="post">
	<label for="subRoot"><b>SubBaseUri</b> (the default allows testing the production version locally):
		<input type="input" name="subRoot" id="subRoot" value="/buildManager/build/">
	</label>
	<br><br>
	<label for="minifyJS"><b>Minify Javascript</b> (alpha):
		<input type="checkbox" name="minifyJS" id="minifyJS">
	</label>
	<br><br>
	<input type="submit" value="BUILD">
</form>

<?= $sms ?? '' ?>