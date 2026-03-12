//hey, if you are seeing that 2a96cbd8b46e442fc41c2b86b821562f, it's not an API key, it's just the placeholder image for when last.fm does not have the album cover
async function getCover(lastfmCover, title, artist) {
  if (lastfmCover && lastfmCover.indexOf("2a96cbd8b46e442fc41c2b86b821562f") === -1) {
    return lastfmCover;
  }
  try {
    var deezerRes = await fetch(
      "https://nimigames-lastfm-proxy-api.vercel.app/api/deezer?q=" + encodeURIComponent(title + " " + artist)
    );
    var deezerData = await deezerRes.json();
    if (deezerData.data && deezerData.data.length > 0 && deezerData.data[0].album.cover_medium) {
      return deezerData.data[0].album.cover_medium;
    }
  } catch (e) {}
  return null;
}

async function loadMusic() {
  try {
    var res = await fetch("https://nimigames-lastfm-proxy-api.vercel.app/api/lastfm");
    var data = await res.json();
    var track = data.recenttracks.track[0];

    var title = track.name;
    var artist = track.artist["#text"];
    var album = track.album["#text"];
    var lastfmCover = track.image && track.image[3] && track.image[3]["#text"];
    var trackUrl = track.url;
    var artistUrl = "https://www.last.fm/music/" + encodeURIComponent(artist);
    var albumUrl  = "https://www.last.fm/music/" + encodeURIComponent(artist) + "/" + encodeURIComponent(album);
    var isNowPlaying = track["@attr"] && track["@attr"].nowplaying === "true";

    var statusText;
    if (isNowPlaying) {
      statusText = "Listening now";
    } else {
      var unixTimestamp = track.date && track.date.uts;
      if (unixTimestamp) {
        var date = new Date(unixTimestamp * 1000);
        var formattedDate = date.toLocaleDateString("en-GB");
        var formattedTime = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
        statusText = "Last listened to \u2022 " + formattedDate + " at " + formattedTime;
      } else {
        statusText = "Last listened to";
      }
    }

    var cover = await getCover(lastfmCover, title, artist);
    var coverHtml = cover ? '<img src="' + cover + '" class="music-cover" alt="Album cover">' : "";
    var googleLyrics = "https://www.google.com/search?q=" + encodeURIComponent(title + " " + artist + " letras");

    document.getElementById("music-widget").innerHTML =
      '<div class="music-status">' + statusText + '</div>' +
      '<div class="music-content">' +
        coverHtml +
        '<div class="music-text">' +
          '<a href="' + trackUrl  + '" target="_blank" class="music-track">'  + title  + '</a>' +
          '<a href="' + artistUrl + '" target="_blank" class="music-artist">' + artist + '</a>' +
          '<a href="' + albumUrl  + '" target="_blank" class="music-album">'  + album  + '</a>' +
        '</div>' +
      '</div>' +
      '<a class="lyrics-link" href="' + googleLyrics + '" target="_blank">Lyrics</a>';

  } catch (err) {
    document.getElementById("music-widget").innerHTML = '<span style="color:#666;font-size:.85rem;">Could not load music data.</span>';
  }
}

loadMusic();
setInterval(loadMusic, 60000);
