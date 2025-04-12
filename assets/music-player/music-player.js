async function searchMusic() {
    let query = document.querySelector('.search-box').value.trim();
    if (!query) return;
    document.querySelector(".results").style.display = "block";
    document.getElementById("music-details").style.display = "none";

    let resultsDiv = document.querySelector('.results');
    resultsDiv.innerHTML = 'Loading...';

    let response = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`);
    let data = await response.json();
    resultsDiv.innerHTML = '';

    data.data.results.slice(0, 10).forEach(track => {
        let div = document.createElement('div');
        window.div = div;
        div.classList.add('result-item');
        div.innerHTML = `<img src="${track.image[0]?.url}" alt="Thumbnail">${track.name} - ${track.artists?.primary?.[0]?.name} - ${track?.album?.name}`;
        div.onclick = () => fetchDownloadUrl(track.id);
        resultsDiv.appendChild(div);
    });
}

async function fetchDownloadUrl(songId) {

    let response = await fetch(`https://saavn.dev/api/songs/${songId}`);
    let data = await response.json();
    console.log('Song Data:', data);

    if (!data.data || !data.data[0].downloadUrl) {
        alert('Audio not available for this track.');
        return;
    }

    let song = data.data[0];
    console.log('Download URLs:', song.downloadUrl); // Log all download URLs

    // Check if there are valid download URLs
    if (song.downloadUrl.length === 0) {
        alert('No valid download URLs found for this track.');
        return;
    }

    // Use the first available download URL
    let audioUrl = song.downloadUrl[song.downloadUrl.length - 1].url;
    let icon_url = song.image[2]?.url;
    let audio_name = song?.name;
    let album_name = song.album?.name;
    let artist_info = song?.artists?.primary;
    let artist_name = "";
    for (const artist in artist_info) {
        artist_name += artist_info[artist].name;
        if (artist < artist_info.length - 1) artist_name += ", ";
    }

    if (!audioUrl) {
        alert('Invalid audio URL.');
        return;
    }


    playMusic(audioUrl);
    document.querySelector(".results").style.display = "none";
    document.getElementById("back-button").style.display = "block";
    document.getElementById("music-details").innerHTML = `<img src = "${icon_url}"><div>${audio_name} - ${artist_name}</div> <div>${album_name}</div>`;
    document.getElementById("music-details").style.display = "block";
    document.querySelector(".audio-controls").style.display = "flex";

}

function playMusic(src) {
    let audioPlayer = document.getElementById('audioPlayer');

    // Check if the src is valid
    if (!src) {
        console.error('Invalid audio source:', src);
        alert('Invalid audio source.');
        return;
    }

    // Set the audio source and play
    audioPlayer.src = src;
    audioPlayer.play().catch(error => {
        console.error('Error playing audio:', error);
        alert('Error playing audio. Please check the audio format or URL.');
    });

}

document.getElementById("back-button").addEventListener("click", function() {
    document.getElementById("music-details").style.display = "none";
    document.querySelector(".results").style.display = "block";
    document.getElementById("back-button").style.display = "none";

});

// Attach event listener instead of inline `oninput`
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.search-box').addEventListener('input', searchMusic);
});

// Customised Player Control Buttons
const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const seekBar = document.getElementById("seekBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

playPauseBtn.addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.innerHTML = `<i class="bi bi-pause"></i>`;
    } else {
        audioPlayer.pause();
        playPauseBtn.innerHTML = `<i class="bi bi-play"></i>`;
    }
});

// Update seek bar in real-time
audioPlayer.addEventListener("timeupdate", () => {
    seekBar.value = audioPlayer.currentTime;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);

    // Update progress color dynamically
    let progress = (audioPlayer.currentTime / audioPlayer.duration) * 100 + "%";
    seekBar.style.setProperty("--progress", progress);
});


// Update seek bar max value when metadata is loaded
audioPlayer.addEventListener("loadedmetadata", () => {
    seekBar.max = audioPlayer.duration;
    durationEl.textContent = formatTime(audioPlayer.duration);
});

// Seek to new position when user changes seek bar
seekBar.addEventListener("input", () => {
    audioPlayer.currentTime = seekBar.value;
});

// Format time in MM:SS format
function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// Function to play music from the selected source
function playMusic(src) {
    audioPlayer.src = src;
    audioPlayer.play();
    playPauseBtn.innerHTML = `<i class="bi bi-pause"></i>`;
}
