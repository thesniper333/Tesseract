const bgUpload = document.getElementById("bg-upload");
let db;

// Open IndexedDB Database
const request = indexedDB.open("BackgroundDB", 1);
request.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("background")) {
        db.createObjectStore("background", {
            keyPath: "id"
        });
    }
};
request.onsuccess = function(event) {
    db = event.target.result;
    loadStoredBackground();
};

// Load stored background on page load
function loadStoredBackground() {
    const transaction = db.transaction(["background"], "readonly");
    const store = transaction.objectStore("background");
    const getRequest = store.get("bgFile");

    getRequest.onsuccess = function() {
        if (getRequest.result) {
            const {
                fileType,
                fileData
            } = getRequest.result;
            if (fileType.startsWith("video/")) {
                setVideoBackground(fileData);
            } else if (fileType.startsWith("image/")) {
                setImageBackground(fileData);
            }
        }
    };
}

// Handle Background Upload
bgUpload.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const fileType = file.type;
        const reader = new FileReader();

        reader.onload = function(e) {
            const fileData = e.target.result;
            saveToIndexedDB(fileType, fileData);

            if (fileType.startsWith("video/")) {
                setVideoBackground(fileData);
            } else if (fileType.startsWith("image/")) {
                setImageBackground(fileData);
            } else {
                alert("Please upload a valid image or video file.");
            }
        };

        reader.readAsDataURL(file);
    }
});

// Save background to IndexedDB
function saveToIndexedDB(fileType, fileData) {
    const transaction = db.transaction(["background"], "readwrite");
    const store = transaction.objectStore("background");
    store.put({
        id: "bgFile",
        fileType,
        fileData
    });
}

// Function to set image background
function setImageBackground(src) {
    document.body.style.background = `url(${src}) no-repeat center center/cover`;
    removeExistingVideo();
}

// Function to set video background
function setVideoBackground(src) {
    removeExistingVideo();
    const video = document.createElement("video");
    video.src = src;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.style.position = "fixed";
    video.style.top = "0";
    video.style.left = "0";
    video.style.width = "100vw";
    video.style.height = "100vh";
    video.style.objectFit = "cover";
    video.style.zIndex = "-1";
    document.body.prepend(video);
}

// Remove existing video (if any)
function removeExistingVideo() {
    const existingVideo = document.querySelector("video");
    if (existingVideo) {
        existingVideo.remove();
    }
}
