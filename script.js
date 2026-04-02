// hey, if you are seeing that 2a96cbd8b46e442fc41c2b86b821562f, it's not an API key, it's just the placeholder image for when last.fm does not have the album cover

var _currentTitle = '';
var _currentArtist = '';

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

// ── Popup ────────────────────────────────────────────────────────────────────
function openPopup(type, triggerBtn) {
  var title  = _currentTitle;
  var artist = _currentArtist;
  var ytmUrl  = "https://music.youtube.com/search?q=" + encodeURIComponent(title + " " + artist);
  var gUrl    = "https://www.google.com/search?q=" + encodeURIComponent(title + " " + artist + " letras");
  var copyTextLyrics = title + " - " + artist + " letras";
  var copyTextMusic  = title + " - " + artist;

  // Remove existing popover
  var existing = document.getElementById('music-popover');
  if (existing) { existing.remove(); return; }

  var platformName = type === 'youtube' ? 'YouTube Music' : 'Google';
  var platformType = type === 'youtube' ? 'streaming service' : 'search engine';
  var openUrl      = type === 'youtube' ? ytmUrl : gUrl;
  var copyText     = type === 'lyrics' ? copyTextLyrics : copyTextMusic;

  var pop = document.createElement('div');
  pop.id = 'music-popover';
  pop.className = 'music-popover';
  pop.innerHTML =
    '<p class="popover-note">You may not use or like <strong>' + platformName + '</strong>. ' +
    'Copy the song name and search it on your ' + platformType + ' of choice.</p>' +
    '<div class="popover-actions">' +
      '<button class="popover-btn" id="popover-copy-btn">Copy Music Name</button>' +
      '<a class="popover-btn" href="' + openUrl + '" target="_blank" rel="noopener" id="popover-open-btn">Open in ' + platformName + '</a>' +
    '</div>';

  document.body.appendChild(pop);

  // Position below the button
  var rect = triggerBtn.getBoundingClientRect();
  var popW = 270;
  var scrollY = window.scrollY || document.documentElement.scrollTop;
  var scrollX = window.scrollX || document.documentElement.scrollLeft;
  var left = Math.min(Math.max(rect.left + scrollX, 8), window.innerWidth - popW - 8);
  pop.style.position = 'absolute';
  pop.style.left = left + 'px';
  pop.style.top  = (rect.bottom + scrollY + 6) + 'px';
  pop.style.width = popW + 'px';

  document.getElementById('popover-copy-btn').onclick = function() {
    navigator.clipboard.writeText(copyText).then(function() {
      var btn = document.getElementById('popover-copy-btn');
      if (btn) { btn.textContent = 'Copied!'; setTimeout(function() { if (btn) btn.textContent = 'Copy Music Name'; }, 2000); }
    });
  };

  document.getElementById('popover-open-btn').onclick = function() {
    var p = document.getElementById('music-popover');
    if (p) p.remove();
  };

  // Close on outside click
  setTimeout(function() {
    document.addEventListener('click', function handler(e) {
      var p = document.getElementById('music-popover');
      if (p && !p.contains(e.target) && e.target !== triggerBtn) {
        p.remove();
        document.removeEventListener('click', handler);
      }
    });
  }, 10);
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var p = document.getElementById('music-popover');
    if (p) p.remove();
  }
});

// ── Music widget ─────────────────────────────────────────────────────────────
function showExplicitTooltip(btn) {
  var existing = document.getElementById('explicit-tooltip');
  if (existing) { existing.remove(); return; }
  var rect = btn.getBoundingClientRect();
  var scrollY = window.scrollY || document.documentElement.scrollTop;
  var scrollX = window.scrollX || document.documentElement.scrollLeft;
  var tip = document.createElement('div');
  tip.id = 'explicit-tooltip';
  tip.className = 'floating-tooltip';
  tip.innerHTML =
    'This is an explicit song, that means that the music lyrics can contain sexual and violent content and swear words. ' +
    'This badge may be incorrect, Deezer\'s API is not managed by me ¯\\(ツ)/¯' +
    '<br><span class="tooltip-close">click anywhere to close</span>';
  tip.style.position = 'absolute';
  tip.style.left = Math.min(rect.left + scrollX, window.innerWidth - 275) + 'px';
  tip.style.top = (rect.bottom + scrollY + 8) + 'px';
  document.body.appendChild(tip);
  setTimeout(function() {
    document.addEventListener('click', function handler() {
      var t = document.getElementById('explicit-tooltip');
      if (t) t.remove();
      document.removeEventListener('click', handler);
    });
  }, 10);
}

function showDurationTooltip(btn) {
  // Remove existing tooltip if any
  var existing = document.getElementById('duration-tooltip');
  if (existing) {
    existing.remove();
    return;
  }
  var rect = btn.getBoundingClientRect();
  var tip = document.createElement('div');
  tip.id = 'duration-tooltip';
  tip.className = 'floating-tooltip';
  tip.innerHTML =
    'This is the song duration, it may be wrong, it may be not, depends on ' +
    '<a href="https://developers.deezer.com/api" target="_blank" rel="noopener">Deezer\'s API</a>. ' +
    'It\'s not my problem ¯\\(ツ)/¯' +
    '<br><span class="tooltip-close">click anywhere to close</span>';

  var scrollY = window.scrollY || document.documentElement.scrollTop;
  var scrollX = window.scrollX || document.documentElement.scrollLeft;
  tip.style.position = 'absolute';
  tip.style.left = Math.min(rect.left + scrollX, window.innerWidth - 275) + 'px';
  tip.style.top = (rect.bottom + scrollY + 8) + 'px';
  document.body.appendChild(tip);

  // Close on next click anywhere
  setTimeout(function() {
    document.addEventListener('click', function handler() {
      var t = document.getElementById('duration-tooltip');
      if (t) t.remove();
      document.removeEventListener('click', handler);
    });
  }, 10);
}

async function loadMusic() {
  try {
    var res = await fetch("https://nimigames68-music.vercel.app/api/lastfm");
    var data = await res.json();
    var track = data.recenttracks.track[0];

    var title       = track.name;
    var artist      = track.artist["#text"];
    var album       = track.album["#text"];
    var lastfmCover = track.image && track.image[3] && track.image[3]["#text"];
    var trackUrl    = track.url;
    var artistUrl   = "https://www.last.fm/music/" + encodeURIComponent(artist);
    var albumUrl    = "https://www.last.fm/music/" + encodeURIComponent(artist) + "/" + encodeURIComponent(album);
    var isNowPlaying = track["@attr"] && track["@attr"].nowplaying === "true";

    _currentTitle  = title;
    _currentArtist = artist;

    var statusText;
    if (isNowPlaying) {
      statusText = "Listening now to";
    } else {
      var unixTimestamp = track.date && track.date.uts;
      if (unixTimestamp) {
        var date = new Date(unixTimestamp * 1000);
        statusText = "Last listened to \u2022 " + date.toLocaleDateString("en-GB") + " at " + date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      } else {
        statusText = "Last listened to";
      }
    }

    var deezerTrack  = await getDeezerData(title, artist);
    var cover        = await getCover(lastfmCover, deezerTrack);
    var coverHtml    = cover
      ? '<img src="' + cover + '" class="music-cover" alt="Album cover">'
      : '<img src="Images/cd-svgrepo-com.svg" class="music-cover music-cover-fallback" alt="No cover">';
    var isExplicit   = deezerTrack && deezerTrack.explicit_lyrics === true;
    var duration     = deezerTrack ? formatDuration(deezerTrack.duration) : null;

    var explicitHtml = isExplicit ? ' <span class="explicit-badge" onclick="showExplicitTooltip(this)">E</span>' : "";
    var durationLabel = duration ? 'Song Duration - ' + duration : 'Song Duration - Unknown';
    var durationHtml = '<button class="music-duration" onclick="showDurationTooltip(this)">' + durationLabel + '</button>';

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
        '<button class="lyrics-link" onclick="openPopup(\'lyrics\', this)">Lyrics</button>' +
        '<button class="youtube-link" onclick="openPopup(\'youtube\', this)">Listen To This Song</button>' +
      '</div>';

  } catch (err) {
    document.getElementById("music-widget").innerHTML = '<span style="color:#666;font-size:.85rem;">Could not load music data. Maybe your internet is bad or am i crazy?</span>';
  }
}

loadMusic();
setInterval(loadMusic, 60000);
