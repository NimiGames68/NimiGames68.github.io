## 🎵 Now Playing

<div align="center">
  <img id="cover" src="" width="160" style="border-radius:12px;"><br><br>

  <b id="title">Loading...</b><br>
  <span id="artist"></span><br><br>

  <sub id="status"></sub>
</div>

<script>
(async () => {
    const res = await fetch("https://nimigames68-music.vercel.app/api/lastfm");
    const data = await res.json();

    document.getElementById("cover").src =
        data.albumArt ||
        data.image ||
        data.cover ||
        "https://placehold.co/300x300?text=No+Cover";

    document.getElementById("title").textContent =
        data.title || data.track || "Unknown Track";

    document.getElementById("artist").textContent =
        data.artist || "Unknown Artist";

    document.getElementById("status").textContent =
        data.nowPlaying
            ? "🟢 Listening now"
            : "⏮ Last played";
})();
</script>
