
document.querySelectorAll('.card').forEach(function(card, i) {
  card.style.animationDelay = (0.1 + i * 0.08) + 's';
  card.addEventListener('animationend', function() { card.style.opacity = '1'; });
});

var PAGES = [
  {
    name: 'Homepage',
    url: 'https://nimigames68.github.io/',
    apis: [
      { name: 'Last.fm API', url: 'https://www.last.fm/api', desc: 'Fetches the currently playing / last played track.' },
      { name: 'Deezer API', url: 'https://developers.deezer.com/api', desc: 'Fallback for album art, explicit flag and song duration.' },
    ]
  },
  {
    name: 'Madeira Island',
    url: 'https://nimigames68.github.io/madeira-island/',
    apis: [
      { name: 'Open-Meteo', url: 'https://open-meteo.com', desc: 'Current weather and temperature for Funchal, Madeira.' },
      { name: 'OpenStreetMap', url: 'https://www.openstreetmap.org', desc: 'Interactive map of the island.' },
      { name: 'Wikipedia REST API', url: 'https://en.wikipedia.org/api/rest_v1/', desc: 'Fetches the coat of arms for each parish via page thumbnails.' },
    ]
  },
];

var acc = document.getElementById('accordion');

PAGES.forEach(function(page) {
  var item = document.createElement('div');
  item.className = 'acc-item';

  var btn = document.createElement('button');
  btn.className = 'acc-header';
  btn.innerHTML = '<span>' + page.name + '</span><span class="acc-arrow">▼</span>';

  var body = document.createElement('div');
  body.className = 'acc-body';

  var inner = document.createElement('div');
  inner.className = 'acc-body-inner acc-api-list';

  page.apis.forEach(function(api) {
    var row = document.createElement('div');
    row.className = 'api-row';
    row.innerHTML =
      '<a href="' + api.url + '" target="_blank" rel="noopener" class="api-name">' + api.name + ' ↗</a>' +
      '<span class="api-desc">' + api.desc + '</span>';
    inner.appendChild(row);
  });

  body.appendChild(inner);
  item.appendChild(btn);
  item.appendChild(body);
  acc.appendChild(item);

  btn.addEventListener('click', function() {
    var isOpen = btn.classList.contains('open');
    acc.querySelectorAll('.acc-header.open').forEach(function(h) { h.classList.remove('open'); });
    acc.querySelectorAll('.acc-body').forEach(function(b) { b.style.maxHeight = null; });
    if (!isOpen) {
      btn.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});
