// OSM Map
function initMap() {
  var iframe = document.getElementById('osm_canvas');
  if (iframe) {
    var doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write('<!DOCTYPE html><html><head>');
    doc.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/leaflet.min.css"/>');
    doc.write('<style>*{margin:0;padding:0;box-sizing:border-box;}html,body,#map{width:100%;height:100%;background:#111;}</style>');
    doc.write('</head><body>');
    doc.write('<div id="map" style="width:100%;height:100%;"></div>');
    doc.write('<scr'+'ipt src="https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/leaflet.min.js"></scr'+'ipt>');
    doc.write('<scr'+'ipt>');
    doc.write('var map=L.map("map",{center:[32.7517501,-16.9817487],zoom:9});');
    doc.write('map.attributionControl.setPrefix(\'&copy; <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &mdash; &copy; <a target="_blank" href="https://carto.com/attributions">CARTO</a>\');');
    doc.write('L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{maxZoom:19}).addTo(map);');
    doc.write('L.marker([32.7517501,-16.9817487]).addTo(map);');
    doc.write('<\/scr'+'ipt>');
    doc.write('</body></html>');
    doc.close();
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMap);
} else {
  initMap();
}

// Accordion for municipalities
var MUNICIPALITIES = [
  { name: "Calheta",          freguesias: ["Arco da Calheta","Calheta","Estreito da Calheta","Fajã da Ovelha","Jardim do Mar","Paul do Mar","Ponta do Pargo","Prazeres"] },
  { name: "Câmara de Lobos",  Freguesias: ["Câmara de Lobos","Curral das Freiras","Estreito de Câmara de Lobos","Jardim da Serra","Quinta Grande"] },
  { name: "Funchal",          Freguesias: ["Imaculado Coração de Maria","Monte","Santa Luzia","Santa Maria Maior","Santo António","São Gonçalo","São Martinho","São Pedro","São Roque","Sé"] },
  { name: "Machico",          Freguesias: ["Água de Pena","Caniçal","Machico","Porto da Cruz","Santo António da Serra (Machico)"] },
  { name: "Ponta do Sol",     Freguesias: ["Canhas","Madalena do Mar","Ponta do Sol"] },
  { name: "Porto Moniz",      Freguesias: ["Achadas da Cruz","Porto Moniz","Ribeira da Janela","Seixal"] },
  { name: "Porto Santo",      Freguesias: ["Porto Santo"] },
  { name: "Ribeira Brava",    Freguesias: ["Campanário","Ribeira Brava","Serra de Água","Tábua"] },
  { name: "Santa Cruz",       Freguesias: ["Camacha","Caniço","Gaula","Santa Cruz","Santo António da Serra (Santa Cruz)"] },
  { name: "Santana",          Freguesias: ["Arco de São Jorge","Faial","Ilha","Santana","São Jorge"] },
  { name: "São Vicente",      Freguesias: ["Boaventura","Ponta Delgada","São Vicente"] }
];

var WIKI = {
  "Arco da Calheta":                    "Arco_da_Calheta",
  "Calheta":                            "Calheta,_Madeira",
  "Estreito da Calheta":                "Estreito_da_Calheta",
  "Fajã da Ovelha":                     "Faj%C3%A3_da_Ovelha",
  "Jardim do Mar":                      "Jardim_do_Mar",
  "Paul do Mar":                        "Paul_do_Mar",
  "Ponta do Pargo":                     "Ponta_do_Pargo",
  "Prazeres":                           "Prazeres,_Madeira",
  "Câmara de Lobos":                    "C%C3%A2mara_de_Lobos,_Madeira",
  "Curral das Freiras":                 "Curral_das_Freiras",
  "Estreito de Câmara de Lobos":        "Estreito_de_C%C3%A2mara_de_Lobos",
  "Jardim da Serra":                    "Jardim_da_Serra",
  "Quinta Grande":                      "Quinta_Grande,_Madeira",
  "Imaculado Coração de Maria":         "Imaculado_Cora%C3%A7%C3%A3o_de_Maria",
  "Monte":                              "Monte,_Madeira",
  "Santa Luzia":                        "Santa_Luzia_(Funchal)",
  "Santa Maria Maior":                  "Santa_Maria_Maior,_Funchal",
  "Santo António":                      "Santo_Ant%C3%B3nio,_Funchal",
  "São Gonçalo":                        "S%C3%A3o_Gon%C3%A7alo_(Funchal)",
  "São Martinho":                       "S%C3%A3o_Martinho_(Funchal)",
  "São Pedro":                          "S%C3%A3o_Pedro_(Funchal)",
  "São Roque":                          "S%C3%A3o_Roque_(Funchal)",
  "Sé":                                 "S%C3%A9_(Funchal)",
  "Água de Pena":                       "%C3%81gua_de_Pena",
  "Caniçal":                            "Cani%C3%A7al",
  "Machico":                            "Machico,_Madeira",
  "Porto da Cruz":                      "Porto_da_Cruz",
  "Santo António da Serra (Machico)":   "Santo_Ant%C3%B3nio_da_Serra_(Machico)",
  "Canhas":                             "Canhas",
  "Madalena do Mar":                    "Madalena_do_Mar",
  "Ponta do Sol":                       "Ponta_do_Sol,_Madeira",
  "Achadas da Cruz":                    "Achadas_da_Cruz",
  "Porto Moniz":                        "Porto_Moniz",
  "Ribeira da Janela":                  "Ribeira_da_Janela",
  "Seixal":                             "Seixal,_Madeira",
  "Porto Santo":                        "Porto_Santo",
  "Campanário":                         "Campan%C3%A1rio,_Madeira",
  "Ribeira Brava":                      "Ribeira_Brava,_Madeira",
  "Serra de Água":                      "Serra_de_%C3%81gua",
  "Tábua":                              "Tabua,_Madeira",
  "Camacha":                            "Camacha,_Madeira",
  "Caniço":                             "Cani%C3%A7o",
  "Gaula":                              "Gaula,_Madeira",
  "Santa Cruz":                         "Santa_Cruz,_Madeira",
  "Santo António da Serra (Santa Cruz)":"Santo_Ant%C3%B3nio_da_Serra_(Santa_Cruz)",
  "Arco de São Jorge":                  "Arco_de_S%C3%A3o_Jorge",
  "Faial":                              "Faial,_Madeira",
  "Ilha":                               "Ilha_(Santana)",
  "Santana":                            "Santana,_Madeira",
  "São Jorge":                          "S%C3%A3o_Jorge,_Madeira",
  "Boaventura":                         "Boaventura,_Madeira",
  "Ponta Delgada":                      "Ponta_Delgada,_Madeira",
  "São Vicente":                        "S%C3%A3o_Vicente,_Madeira"
};

var MUNICIPIO_PREFIX = {
  'Calheta': { folder: 'calheta', images: {
    'Arco da Calheta': 'Arco-da-Calheta.png',
    'Calheta': 'Calheta.png',
    'Estreito da Calheta': 'Estreito-da-Calheta.png',
    'Fajã da Ovelha': 'Fajã-da-Ovelha.png',
    'Jardim do Mar': 'Jardim-do-Mar.png',
    'Paul do Mar': 'Paul-do-Mar.png',
    'Ponta do Pargo': 'ponta-do-pargo.png',
    'Prazeres': 'Prazeres.png'
  }},
  'Câmara de Lobos': { folder: 'camara-de-lobos', images: {
    'Câmara de Lobos': 'cmt-camaralobos_converted.png',
    'Curral das Freiras': 'cmt-curralfreiras_converted.png',
    'Estreito de Câmara de Lobos': 'estreito-de-camara-de-lobos.png',
    'Jardim da Serra': 'jardim-da-serra.png',
    'Quinta Grande': 'quinta-grande.png'
  }},
  'Funchal': { folder: 'funchal', images: {
    'Imaculado Coração de Maria': 'fnc-imaculadocoracaomaria_converted.png',
    'Monte': 'fnc-monte_converted.png',
    'Santa Luzia': 'fnc-sluzia_converted.png',
    'Santa Maria Maior': 'fnc-smariamaior_converted.png',
    'Santo António': 'fnc-santonio_converted.png',
    'São Gonçalo': 'fnc-sgoncalo_converted.png',
    'São Martinho': 'fnc-smartinho_converted.png',
    'São Pedro': 'fnc-spedro_converted.png',
    'São Roque': 'fnc-sroque_converted.png',
    'Sé': 'fnc-se_converted.png'
  }},
  'Machico': { folder: 'machico', images: {
    'Água de Pena': 'mch-aguapena_converted.png',
    'Caniçal': 'mch-canical_converted.png',
    'Machico': 'mch-machico_converted.png',
    'Porto da Cruz': 'mch-portocruz_converted.png',
    'Santo António da Serra (Machico)': 'mch-santonioserra_converted.png'
  }},
  'Ponta do Sol': { folder: 'ponta-do-sol', images: {
    'Canhas': 'pts-canhas_converted.png',
    'Madalena do Mar': 'pts-madalenamar_converted.png',
    'Ponta do Sol': 'pts-pontasol_converted.png'
  }},
  'Porto Moniz': { folder: 'porto-moniz', images: {
    'Achadas da Cruz': 'pmz-achadascruz_converted.png',
    'Porto Moniz': 'pmz-portomoniz_converted.png',
    'Ribeira da Janela': 'pmz-ribeirajanela_converted.png',
    'Seixal': 'pmz-seixal_converted.png'
  }},
  'Porto Santo': { folder: 'porto-santo', images: {
    'Porto Santo': 'pst1_converted.png'
  }},
  'Ribeira Brava': { folder: 'ribeira-brava', images: {
    'Campanário': 'rbr-campanario_converted.png',
    'Ribeira Brava': 'rbr-ribeirabrava_converted.png',
    'Serra de Água': 'rbr-serraagua_converted.png',
    'Tábua': 'rbr-tabua_converted.png'
  }},
  'Santa Cruz': { folder: 'santa-cruz', images: {
    'Camacha': 'scr-camacha.gif',
    'Caniço': 'scr-canico.gif',
    'Gaula': 'scr-gaula.gif',
    'Santa Cruz': 'scr-santacruz.gif',
    'Santo António da Serra (Santa Cruz)': 'scr-santonioserra.gif'
  }},
  'Santana': { folder: 'santana', images: {
    'Arco de São Jorge': 'stn-arcosjorge_converted.png',
    'Faial': 'stn-faial_converted.png',
    'Ilha': 'stn-ilha_converted.png',
    'Santana': 'stn-santana_converted.png',
    'São Jorge': 'stn-sjorge_converted.png'
  }},
  'São Vicente': { folder: 'sao-vicente', images: {
    'Boaventura': 'svc-boaventura_converted.png',
    'Ponta Delgada': 'svc-pontadelgada_converted.png',
    'São Vicente': 'svc-svicente_converted.png'
  }}
};

var acc = document.getElementById('accordion');

MUNICIPALITIES.forEach(function(m) {
  var item = document.createElement('div');
  item.className = 'acc-item';

  var btn = document.createElement('button');
  btn.className = 'acc-header';
  btn.innerHTML = m.name + '<span class="acc-arrow">▼</span>';

  var body = document.createElement('div');
  body.className = 'acc-body';

  var inner = document.createElement('div');
  inner.className = 'acc-body-inner acc-grid';

  var Freguesias = m.Freguesias || m.freguesias;
  var config = MUNICIPIO_PREFIX[m.name];
  if (config) {
    Freguesias.forEach(function(f) {
      var displayName = f.replace(' (Machico)', '').replace(' (Santa Cruz)', '');
      var imageName = config.images[f] || config.images[displayName];
      var imagePath = imageName ? 'images/conselhos/' + config.folder + '/' + imageName : null;
      var wikiSlug = WIKI[f] || encodeURIComponent(f);

      var card = document.createElement('a');
      card.href = 'https://en.wikipedia.org/wiki/' + wikiSlug;
      card.target = '_blank';
      card.rel = 'noopener';
      card.className = 'freg-card';

      var imgWrap = document.createElement('div');
      imgWrap.className = 'freg-coa-wrap';

      var img = document.createElement('img');
      img.className = 'freg-coa';
      img.src = imagePath;
      img.alt = displayName;

      var label = document.createElement('span');
      label.className = 'freg-name';
      label.textContent = displayName;

      imgWrap.appendChild(img);
      card.appendChild(imgWrap);
      card.appendChild(label);

      inner.appendChild(card);
    });
  }

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
      setTimeout(function() { body.style.maxHeight = body.scrollHeight + 'px'; }, 100);
    }
  });
});

// Weather
var tempC = null, tempF = null;
function wmoInfo(code) {
  var map = {
    0:{desc:'Clear sky'},1:{desc:'Mainly clear'},2:{desc:'Partly cloudy'},3:{desc:'Overcast'},
    45:{desc:'Foggy'},48:{desc:'Icy fog'},51:{desc:'Light drizzle'},53:{desc:'Moderate drizzle'},
    55:{desc:'Dense drizzle'},61:{desc:'Slight rain'},63:{desc:'Moderate rain'},65:{desc:'Heavy rain'},
    66:{desc:'Freezing rain'},67:{desc:'Heavy freezing rain'},71:{desc:'Slight snow'},
    73:{desc:'Moderate snow'},75:{desc:'Heavy snow'},77:{desc:'Snow grains'},
    80:{desc:'Slight showers'},81:{desc:'Moderate showers'},82:{desc:'Violent showers'},
    85:{desc:'Snow showers'},86:{desc:'Heavy snow showers'},95:{desc:'Thunderstorm'},
    96:{desc:'Thunderstorm w/ hail'},99:{desc:'Thunderstorm w/ heavy hail'}
  };
  return map[code] || {desc:'Unknown'};
}
fetch('https://api.open-meteo.com/v1/forecast?latitude=32.6669&longitude=-16.9241&current_weather=true&temperature_unit=celsius')
  .then(function(r){return r.json();})
  .then(function(d){
    tempC = Math.round(d.current_weather.temperature * 10) / 10;
    tempF = Math.round(tempC * 9/5 + 32);
    document.getElementById('temp-value').textContent = tempC + ' °C';
    document.getElementById('weather-desc').textContent = wmoInfo(d.current_weather.weathercode).desc;
    document.getElementById('temp-switch').style.display = 'flex';
  })
  .catch(function(){document.getElementById('temp-value').textContent = 'Unavailable';});

function showCelsius(e){
  if(e) e.preventDefault();
  document.getElementById('temp-value').textContent = tempC + ' °C';
  document.getElementById('btn-c').classList.add('active');
  document.getElementById('btn-f').classList.remove('active');
}
function showFahrenheit(e){
  if(e) e.preventDefault();
  document.getElementById('temp-value').textContent = tempF + ' °F';
  document.getElementById('btn-f').classList.add('active');
  document.getElementById('btn-c').classList.remove('active');
}

var btnC = document.getElementById('btn-c');
if (btnC) btnC.addEventListener('click', showCelsius);
var btnF = document.getElementById('btn-f');
if (btnF) btnF.addEventListener('click', showFahrenheit);

// Time
function updateTime(){
  var t = new Date().toLocaleTimeString('en-GB',{timeZone:'Atlantic/Madeira',hour:'2-digit',minute:'2-digit',second:'2-digit'});
  document.getElementById('time-value').textContent = t;
}
updateTime();
setInterval(updateTime, 1000);

// Music Player
var audio = document.getElementById('madeira-audio');
var btn = document.getElementById('music-player-btn');
var slider = document.getElementById('music-player-slider');
var timeCurrent = document.getElementById('music-player-time-current');
var timeTotal = document.getElementById('music-player-time-total');

function formatTime(sec) {
  if (isNaN(sec)) return '0:00';
  var m = Math.floor(sec / 60);
  var s = Math.floor(sec % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

if (btn) {
  btn.addEventListener('click', function() {
    if (audio.paused) {
      audio.play();
      btn.textContent = '⏸';
    } else {
      audio.pause();
      btn.textContent = '▶';
    }
  });
}

if (slider) {
  slider.addEventListener('input', function() {
    if (audio && !isNaN(audio.duration)) {
      audio.currentTime = (slider.value / 100) * audio.duration;
    }
  });
}

if (audio) {
  audio.addEventListener('loadedmetadata', function() {
    if (timeTotal) timeTotal.textContent = formatTime(audio.duration);
    if (slider) slider.max = '100';
  });

  audio.addEventListener('timeupdate', function() {
    if (timeCurrent) timeCurrent.textContent = formatTime(audio.currentTime);
    if (slider && !slider.classList.contains('dragging')) {
      slider.value = (audio.currentTime / audio.duration) * 100;
    }
  });

  audio.addEventListener('ended', function() {
    if (btn) btn.textContent = '▶';
  });

  audio.addEventListener('play', function() {
    if (btn) btn.textContent = '⏸';
  });

  audio.addEventListener('pause', function() {
    if (btn) btn.textContent = '▶';
  });
}

// ===== NAV MODULE =====
(function(){
  var path = window.location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('.nav-sitemap a').forEach(function(a){
    var href = a.getAttribute('href') || '';
    var ap = href.replace('https://nimigames68.github.io','').replace(/\/+$/, '') || '/';
    if (ap === path || (ap.length > 1 && path.startsWith(ap))) {
      a.style.cssText += 'color:#43C97E!important;outline:1px solid #43C97E;border-radius:4px;padding:.2rem .5rem;';
    }
  });
})();
