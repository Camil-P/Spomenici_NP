<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form style="margin: 2% auto;" action="sights.php" method="POST" enctype="multipart/form-data">
        <label for="name">Ime:</label>
        <input style="margin-bottom: 1%;" type="text" name="name" id="name" required><br>
        <label for="streetLocation">Lokacija/Ulica:</label>
        <input style="margin-bottom: 1%;" type="text" name="streetLocation" id="streetLocation"><br>
        <label for="city">Grad:</label>
        <select style="margin-bottom: 1%;" name="city" id="city" required>
            <option value="Novi Pazar">Novi Pazar</option>
            <option value="Sjenica">Sjenica</option>
            <option value="Tutin">Tutin</option>
            <option value="Raska">Raska</option>
        </select><br>
        <label for="category">Kategorija:</label>
        <select style="margin-bottom: 1%;" name="category" id="category" required>
            <option value="Islamska kultura">Spomenik islamske kulture</option>
            <option value="Pravoslavna kultura">Spomenik pravoslavne kulture</option>
            <option value="Kulturno istorijski spomenici">Kulturno istorijski spomenik</option>
            <option value="Poruseni objekti">Poruseni objekat</option>
            <option value="Prirodne lepote">Prirodna lepota</option>
            <option value="Gradske zanimljivosti">Gradska zanimljivost</option>
        </select><br>
        <label for="description">Opis:</label><br>
        <textarea style="margin-bottom: 1%;" name="description" id="description" rows="15" cols="60" required></textarea><br>
        <label for="latitude">Latitude (X):</label>
        <input style="margin-bottom: 1%;" type="text" name="latitude" id="latitude" required><br>
        <label for="longitude">Longitude (Y):</label>
        <input style="margin-bottom: 1%;" type="text" name="longitude" id="longitude" required><br>
        <label for="videoUrl">Video Url:</label>
        <input style="margin-bottom: 1%;" type="text" name="videoUrl" id="videoUrl"><br>
        <label>Unesite slike:</label><br>
        <!-- <input type="number" name="imgNumber" id="imgNumber"><hr>
        <button type="submit" name="mode" value="NEXT">NEXT</button>
    </form>
</body>
</html> -->