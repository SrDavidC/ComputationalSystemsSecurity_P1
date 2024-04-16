<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    if (!empty($username) && !empty($password)) {
        $hashed_password = hash("sha256", $password);
        $file = fopen("user.csv", "a");
        if ($file) {
            if (fputcsv($file, array($username, $hashed_password))) {
                fclose($file);
                echo "User: " . $username . " has been registered";
            } else {
                echo "Error: It could not write on CSV file.";
            }
        } else {
            echo "Error: It could not open CSV file.";
        }
    } else {
        echo "Error: Fields are missing.";
    }
}
?>
