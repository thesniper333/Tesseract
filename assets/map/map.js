if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            // Get latitude and longitude
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Update iframe src with user's location
            const mapFrame = document.getElementById("mapFrame");
            mapFrame.src = `https://www.google.com/maps?q=${lat},${lon}&z=15&output=embed`;
        },
        function(error) {
            console.error("Geolocation error:", error);
            alert("Couldn’t get your location. Default map shown.");
        }
    );
} else {
    alert("Geolocation is not supported by your browser.");
}
