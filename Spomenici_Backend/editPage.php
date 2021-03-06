<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <form id="forma" style="margin: 2% auto;" action="sights.php" method="POST" enctype="multipart/form-data">
        <input name="id" id="id" type="hidden">
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
        <label>Izmenite slike:</label><br>
        <button type="button" onclick="addPicInput()">DODAJ SLIKU</button><hr>
        <div id="picContainer"></div><hr>
        <button type="submit" name="mode" value="CHANGE_SIGHT">POTVRDI IZMENU</button>
    </form>
    <script>
        var hahu = <?php echo json_encode($row) ?>;
        hahu = JSON.parse(hahu);
        
        const picContainer = document.getElementById('picContainer');
        document.getElementById('id').value = hahu.id;
        document.getElementById('name').value = hahu.name;
        document.getElementById('streetLocation').value = hahu.streetLocation;
        document.getElementById('city').selectedItem = hahu.city;
        document.getElementById('category').selectedItem = hahu.category;
        document.getElementById('description').innerHTML = hahu.description;
        document.getElementById('latitude').value = hahu.latitude;
        document.getElementById('latitude').value = hahu.latitude;
        document.getElementById('longitude').value = hahu.longitude;
        document.getElementById('videoUrl').value = hahu.videoUrl;
        
        var pictures = [];
        for(i = 0; i < hahu.imageUrls.length; i++){
            pictures.push("http://localhost/Spomenici/Assets/" + hahu.imageUrls[i]);
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.value = hahu.imageUrls[i];
            input.name = 'checkedImages[]';
            input.checked = true;
            const img = document.createElement('img');
            img.src = pictures[i];
            img.alt = hahu.imageUrls[i];
            img.style['width'] = '250px';
            img.style['margin-right'] = '20px';
            picContainer.appendChild(input);
            picContainer.appendChild(img);
        }

        var numberOfAddedPhotos = 0;
        function addPicInput(){
            const newPicInput = document.createElement('input');
            newPicInput.type = 'file';
            newPicInput.name = 'addedPhotos[]';
            newPicInput.id = 'photo'+numberOfAddedPhotos;
            const cancelButton = document.createElement('button');
            cancelButton.id = 'photo'+numberOfAddedPhotos;
            cancelButton.innerHTML = 'X';
            cancelButton.type = 'button';
            cancelButton.addEventListener('click', removePhotoInput);
            cancelButton.title = 'Remove added photo input.';
            cancelButton.style['margin-right'] = '20px';
            picContainer.appendChild(newPicInput);
            picContainer.appendChild(cancelButton);
            numberOfAddedPhotos += 1;
        }

        function removePhotoInput(evt){
            cancelButton = evt.target;
            fileInput = document.getElementById(cancelButton.id);
            fileInput.remove();
            cancelButton.remove();
        }
    </script>
</body>

</html>