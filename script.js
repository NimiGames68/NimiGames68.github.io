// hey, if you are seeing that 2a96cbd8b46e442fc41c2b86b821562f, it's not an API key, it's just the placeholder image for when last.fm does not have the album cover

async function getDeezerData(title, artist) {
  try {
    var res = await fetch(
      "https://nimigames-lastfm-proxy-api.vercel.app/api/deezer?q=" + encodeURIComponent(title + " " + artist)
    );
    var data = await res.json();
    if (data.data && data.data.length > 0) return data.data[0];
  } catch (e) {}
  return null;
}

async function getCover(lastfmCover, deezerTrack) {
  if (lastfmCover && lastfmCover.indexOf("2a96cbd8b46e442fc41c2b86b821562f") === -1) return lastfmCover;
  if (deezerTrack && deezerTrack.album && deezerTrack.album.cover_medium) return deezerTrack.album.cover_medium;
  return null;
}

function formatDuration(seconds) {
  if (!seconds) return null;
  var m = Math.floor(seconds / 60);
  var s = seconds % 60;
  return m + ":" + (s < 10 ? "0" : "") + s;
}

async function loadMusic() {
  try {
    var res = await fetch("https://nimigames-lastfm-proxy-api.vercel.app/api/lastfm");
    var data = await res.json();
    var track = data.recenttracks.track[0];

    var title      = track.name;
    var artist     = track.artist["#text"];
    var album      = track.album["#text"];
    var lastfmCover = track.image && track.image[3] && track.image[3]["#text"];
    var trackUrl   = track.url;
    var artistUrl  = "https://www.last.fm/music/" + encodeURIComponent(artist);
    var albumUrl   = "https://www.last.fm/music/" + encodeURIComponent(artist) + "/" + encodeURIComponent(album);
    var isNowPlaying = track["@attr"] && track["@attr"].nowplaying === "true";

    var statusText;
    if (isNowPlaying) {
      statusText = "Listening now";
    } else {
      var unixTimestamp = track.date && track.date.uts;
      if (unixTimestamp) {
        var date = new Date(unixTimestamp * 1000);
        statusText = "Last listened to \u2022 " + date.toLocaleDateString("en-GB") + " at " + date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      } else {
        statusText = "Last listened to";
      }
    }

    var deezerTrack = await getDeezerData(title, artist);
    var cover       = await getCover(lastfmCover, deezerTrack);
    var coverHtml   = cover ? '<img src="' + cover + '" class="music-cover" alt="Album cover">' : "";
    var isExplicit  = deezerTrack && deezerTrack.explicit_lyrics === true;
    var duration    = deezerTrack ? formatDuration(deezerTrack.duration) : null;

    var explicitHtml = isExplicit ? ' <span class="explicit-badge">E</span>' : "";
    var durationHtml = duration   ? '<span class="music-duration">Song Duration - ' + duration + '</span>' : "";

    var googleLyrics = "https://www.google.com/search?q=" + encodeURIComponent(title + " " + artist + " letras");
    var youtubeUrl   = "https://music.youtube.com/search?q=" + encodeURIComponent(title + " " + artist);

    document.getElementById("music-widget").innerHTML =
      '<div class="music-status">' + statusText + '</div>' +
      '<div class="music-content">' +
        coverHtml +
        '<div class="music-text">' +
          '<span class="music-track-line"><a href="' + trackUrl + '" target="_blank" class="music-track">' + title + '</a>' + explicitHtml + '</span>' +
          '<a href="' + artistUrl + '" target="_blank" class="music-artist">' + artist + '</a>' +
          '<a href="' + albumUrl  + '" target="_blank" class="music-album">'  + album  + '</a>' +
          durationHtml +
        '</div>' +
      '</div>' +
      '<div class="music-meta">' +
        '<a class="lyrics-link" href="' + googleLyrics + '" target="_blank">Lyrics</a>' +
        '<a class="youtube-link" href="' + youtubeUrl + '" target="_blank">Listen To This Song</a>' +
      '</div>';

  } catch (err) {
    document.getElementById("music-widget").innerHTML = '<span style="color:#666;font-size:.85rem;">Could not load music data. Maybe your internet is bad or am i crazy?</span>';
  }
}

loadMusic();
setInterval(loadMusic, 60000);
