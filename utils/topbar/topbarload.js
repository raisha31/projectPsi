// loadSidebar.js
document.addEventListener("DOMContentLoaded", function() {
    fetch('utils/topbar/topbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('topbarContainer').innerHTML = data;
        });
});
