function performSearch() {
    const query = document.getElementById("searchInput").value;
    const engine = document.getElementById("searchEngine").value;
    if (query) {
        window.open(engine + encodeURIComponent(query), "_blank");
    }
}

// Search on button click
document.getElementById("search").addEventListener("click", performSearch);

// Search on Enter key
document.getElementById("searchInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        performSearch();
    }
});

document.getElementById("searchInput").addEventListener("click", function() {
    document.getElementById("searchInput").style.boxShadow = "0px 5px 15px rgba(0, 0, 0, 0.3)";
    document.getElementById("search").style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
});


// Hide shadow when clicked outside
document.addEventListener("click", function(event) {

    const searchinput = document.getElementById("searchInput");
    const search = document.getElementById("search");

    if (event.target !== searchinput) {
        searchinput.style.boxShadow = "none";
        search.style.boxShadow = "none";
    }
});
