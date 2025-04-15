function fetchVideoQualities() {
    let videoUrl = document.getElementById("videoLink").value.trim();
    if (!videoUrl) {
        alert("Please enter a valid Facebook Video URL");
        return;
    }

    fetch("/get_fb_video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoUrl })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert("Error: " + data.error);
            return;
        }

        document.getElementById("videoTitle").innerText = data.title;
        document.getElementById("videoThumbnail").src = data.thumbnail;
        document.getElementById("videoDetails").classList.remove("hidden");

        let select = document.getElementById("qualitySelect");
        select.innerHTML = "";

        data.formats.forEach(format => {
            let option = document.createElement("option");
            option.value = format.url;
            option.textContent = format.quality;
            select.appendChild(option);
        });

        document.getElementById("qualityContainer").classList.remove("hidden");
    })
    .catch(error => {
        console.error("Error fetching video:", error);
        alert("An error occurred while fetching the video.");
    });
}

function downloadVideo() {
    let selectedUrl = document.getElementById("qualitySelect").value;
    window.location.href = "/download?url=" + encodeURIComponent(selectedUrl);
}
