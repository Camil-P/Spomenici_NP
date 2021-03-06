<?php
function cors()
{

    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        header("Access-Control-Allow-Origin: *");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            // may also be using PUT, PATCH, HEAD etc
            header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }
    header('Content-Type: application/json');
}

function displayLogin()
{
    print('<form enctype="application/x-www-form-urlencoded" style="border: 2px solid grey; width: 20%; height: 15rem; margin: 10% auto; display: flex; flex-direction: column; justify-content: center; align-content: center;" action="sights.php" method="POST">');
    print('<label style="text-align: center;" for="username">Username:</label>');
    print('<input type="text" name="username" id="username" required><br>');
    print('<label style="text-align: center;" for="password">Password:</label>');
    print('<input type="password" name="password" id="username" required><br>');
    print('<button type="submit" name="mode" value="LOGIN">Login</button>');
    print('</form>');
}

function connectToDB()
{
    $serverName = "localhost";
    $username = "root";
    $password = "";
    $dbname = "spomenici";

    $conn = new mysqli($serverName, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

function getSights()
{
    $conn = connectToDB();
    $sql = "SELECT id, name, description, category, streetLocation, city, latitude, longitude, imageUrls, videoUrl FROM sight";
    $result = $conn->query($sql);

    $sights = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $row['imageUrls'] = unserialize($row['imageUrls']);
            for ($i = 0; $i < count($row['imageUrls']); $i++) {
                $row['imageUrls'][$i] = "http://localhost/Spomenici-Projekat/Spomenici_Backend/Assets/" . $row['imageUrls'][$i];
            }
            $sights[] = $row;
        }
    }
    $response = strip_tags(json_encode($sights));
    echo $response;
}

function printHeader()
{
    print('<head>');
    print('<style>');
    print('table, th, td {border: 1px solid black; border-collapse: collapse;}');
    print('<style>');
    print('</style>');
    print('<table>');
    print('<tr>');
    print('<th>Ime</th>');
    print('<th>Opis</th>');
    print('<th>Kategorija</th>');
    print('<th>Lokacija</th>');
    print('<th>Grad</th>');
    print('<th>Latitude</th>');
    print('<th>Longitude</th>');
    print('<th>imageUrls</th>');
    print('<th>videoUrl</th>');
    print('<th></th>');
    print('<th></th>');
    print('</tr>');
}

function displaySights()
{
    $conn = connectToDB();
    $sql = "SELECT id, name, description, category, streetLocation, city, latitude, longitude, imageUrls, videoUrl FROM sight";
    $result = $conn->query($sql);
    print('<form enctype="application/x-www-form-urlencoded" style="margin: 2% auto;" action="sights.php" method="POST">');
    print('<label for="nmb">Unesite broj slika za spomenik koji zelite kreirati: </label>');
    print('<input type="number" id="nmb" name="nmb" required><br>');
    print('<button type="submit" name="mode" value="ADD_EDITOR">START ADDING</button>');
    print('</form>');
    print('<hr>');
    if ($result->num_rows > 0) {
        printHeader();
        while ($row = $result->fetch_assoc()) {
            $imageUrls_dsr = unserialize($row['imageUrls']);
            $strImgNames = "";
            foreach ($imageUrls_dsr as $key => $value) {
                $strImgNames = $strImgNames . "  " . $value;
            }
            print("<tr>");
            print("<td>" . $row['name'] . "</td>");
            print("<td>" . $row['description'] . "</td>");
            print("<td>" . $row['category'] . "</td>");
            print("<td>" . $row['streetLocation'] . "</td>");
            print("<td>" . $row['city'] . "</td>");
            print("<td>" . $row['latitude'] . "</td>");
            print("<td>" . $row['longitude'] . "</td>");
            print("<td>" . $strImgNames . "</td>");
            print("<td>" . $row['videoUrl'] . "</td>");
            print("<td><a href='sights.php?id=" . $row['id'] . "&mode=EDIT_EDITOR'>EDIT</a></td>");
            print("<td><a href='sights.php?id=" . $row['id'] . "&mode=DELETE'>DELETE</a></td>");
            print("</tr>");
        }
        print("</table>");
    } else {
        echo "Nema spomenika";
    }

    $conn->close();
}

function displayAddingEditor($imgNumber)
{
    include('createPage.php');
    for ($i = 0; $i < $imgNumber; $i++) {
        print('<input type="file" name="pic' . $i . '">');
    }
    print('<input type="hidden" name="nmb" value="' . $imgNumber . '"><br><br>');
    print('<button type="submit" name="mode" value="ADD">ADD SIGHT</button>');
    print('</form>');
}

function addSightToDB()
{
    $conn = connectToDB();
    $numberOfPics = $_POST['nmb'];
    $errorMsg = [];
    $picNameArray = [];
    $acceptedIndexArray = [];
    for ($i = 0; $i < $numberOfPics; $i++) {
        if (
            $_FILES['pic' . $i]['type'] == "image/gif" ||
            $_FILES['pic' . $i]['type'] == "image/pjpeg" ||
            $_FILES['pic' . $i]['type'] == "image/jpeg" ||
            $_FILES['pic' . $i]['type'] == "image/png"
        ) {
            $picNameArray[] = $_FILES['pic' . $i]["name"];
            $acceptedIndexArray[] = $i;                     //Indexes of array of valid pics
        } else {
            $errorMsg[] = 'Failed to add file named ' . $_FILES['pic' . $i]["name"] . ' File named ' . $_FILES['pic' . $i]["name"] . ' is not a picture.';
        }
    }

    $sr_picNameArray = serialize($picNameArray);

    $sql = "INSERT INTO sight (name, description, category, streetLocation, city, latitude, longitude, imageUrls, videoUrl) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssssddss', $_POST['name'], $_POST['description'], $_POST['category'], $_POST['streetLocation'], $_POST['city'], $_POST['latitude'], $_POST['longitude'], $sr_picNameArray, $_POST['videoUrl']);
    $stmt->execute();

    for ($j = 0; $j < count($acceptedIndexArray); $j++) {
        move_uploaded_file($_FILES['pic' . $acceptedIndexArray[$j]]['tmp_name'], "Assets/" . basename($_FILES['pic' . $acceptedIndexArray[$j]]['name']));
    }

    $conn->close();

    displaySights();
}

function displayConfirmation()
{
    print('<div style="border: 2px solid grey; width: 20%; height: 8rem; margin: 10% auto; display: flex; flex-direction: column; justify-content: center; align-content: center;">');
    print('<h3 style="text-align:center">Da li ste sigurni?</h3><br>');
    print('<div style="margin:auto">');
    print('<a style="margin-right:10px" type="button" href="sights.php?id=' . $_GET['id'] . '&mode=CONFIRM_DELETE">DA</a>');
    print('<a style="margin-left:10px" type="button" href="sights.php?mode=CANCEL_DELETE">NE</a>');
    print('</div>');
    print('</div>');
}

function deleteSightFromDB()
{
    $conn = connectToDB();
    $sql = "DELETE FROM sight WHERE id=" . $_GET['id'];

    if ($conn->query($sql) === TRUE) {
        $conn->close();
        displaySights();
    } else {
        echo "Error deleting record: " . $conn->error;
    }
}

function changeEditor()
{
    $conn = connectToDB();
    $sql = "SELECT * FROM sight WHERE id=" . $_GET['id'];
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $row['imageUrls'] = unserialize($row['imageUrls']);
    $row = json_encode($row);
    include('editPage.php');
}

function updateSightInDb()
{
    $conn = connectToDB();
    $sql = "SELECT * FROM sight WHERE id=" . $_POST['id'];
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $row['imageUrls'] = unserialize($row['imageUrls']);

    if (isset($_POST['checkedImages'])) {
        foreach ($row['imageUrls'] as $key => $value) {
            $check = false;
            foreach ($_POST['checkedImages'] as $keyChecked => $valueChecked) {
                if ($value === $valueChecked) {
                    $check = true;
                }
            }
            if ($check == false) {
                unlink("Assets/" . $value);
                array_splice($row['imageUrls'], $key, $key + 1);
            }
        }
    }

    $sql = "UPDATE sight SET name=?, description=?, category=?, streetLocation=?, city=?, latitude=?, longitude=?, imageUrls=?, videoUrl=? WHERE id=?";
    $stmt = $conn->prepare($sql);

    if (isset($_FILES['addedPhotos'])) {
        for ($j = 0; $j < count($_FILES['addedPhotos']['name']); $j++) {
            if (
                $_FILES['addedPhotos']['type'][$j] == "image/gif" ||
                $_FILES['addedPhotos']['type'][$j] == "image/pjpeg" ||
                $_FILES['addedPhotos']['type'][$j] == "image/jpeg" ||
                $_FILES['addedPhotos']['type'][$j] == "image/png"
            ) {
                $row['imageUrls'][] = $_FILES['addedPhotos']['name'][$j];                   //Indexes of array of valid pics
                $name = $_FILES['addedPhotos']['name'][$j];
                move_uploaded_file($_FILES['addedPhotos']['tmp_name'][$j], "Assets/" . basename($name));
            } else {
                $errorMsg[] = 'Failed to add file named ' . $_FILES['addedPhotos']['name'][$j] . ' File named ' . $_FILES['addedPhotos']['name'][$j] . ' is not a picture.';
            }
        }
    }
    $imgArray_sr = serialize($row['imageUrls']);
    $stmt->bind_param("sssssddssi", $_POST['name'], $_POST['description'], $_POST['category'], $_POST['streetLocation'], $_POST['city'], $_POST['latitude'], $_POST['longitude'], $imgArray_sr, $_POST['videoUrl'], $_POST['id']);
    $stmt->execute();
    $conn->close();
    displaySights();
}
?>
<html>

<body>
    <?php
    if (isset($_REQUEST["mode"])) {
        if($_REQUEST['mode'] == 'SIGHTS'){
            cors();
            getSights();
        }
        else{
            if (!isset($_COOKIE['LoggedUser'])) {
                if ($_REQUEST["mode"] === 'LOGIN') {
                    $username = $_POST['username'];
                    $password = $_POST['password'];
                    if ($username == 'riscnovipazar' && $password == 'discover.123') {
                        $timeDuration = time() + (60 * 60 * 24);
                        setcookie('LoggedUser', time(), $timeDuration);
                        displaySights();
                    }
                    else{
                        echo ('<p style="color:red">Pogresno uneti podaci</p>');
                        displayLogin();
                    }
                } else {
                    displayLogin();
                }
            } else {
                switch ($_REQUEST["mode"]) {
                    case 'ADD_EDITOR':
                        displayAddingEditor($_POST['nmb']);
                        break;
                    case 'ADD':
                        addSightToDB();
                        break;
                    case 'DELETE':
                        displayConfirmation();
                        break;
                    case 'CONFIRM_DELETE':
                        deleteSightFromDB();
                        break;
                    case 'CANCEL_DELETE':
                        displaySights();
                        break;
                    case 'SIGHTS':
                        cors();
                        getSights();
                        break;
                    case 'EDIT_EDITOR':
                        changeEditor();
                        break;
                    case 'CHANGE_SIGHT':
                        updateSightInDb();
                        break;
                }
            }
        }
    } else {
        if (isset($_COOKIE['LoggedUser'])) {
            displaySights();
        } else {
            displayLogin();
        }
    }
    ?>
</body>

</html>