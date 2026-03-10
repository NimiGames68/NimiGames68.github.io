// ── Map toggle ──────────────────────────────────────────────────────────────
function switchMap(type) {
  document.getElementById('frame-map').classList.toggle('hidden', type !== 'map');
  document.getElementById('frame-satellite').classList.toggle('hidden', type !== 'satellite');
  document.getElementById('btn-map').classList.toggle('active', type === 'map');
  document.getElementById('btn-satellite').classList.toggle('active', type === 'satellite');
}

// ── Accordion data (alphabetical order) ────────────────────────────────────
var MUNICIPALITIES = [
  { name: "Calheta",          freguesias: ["Arco da Calheta","Calheta","Estreito da Calheta","Fajã da Ovelha","Jardim do Mar","Paul do Mar","Ponta do Pargo","Prazeres"] },
  { name: "Câmara de Lobos",  freguesias: ["Câmara de Lobos","Curral das Freiras","Estreito de Câmara de Lobos","Jardim da Serra","Quinta Grande"] },
  { name: "Funchal",          freguesias: ["Imaculado Coração de Maria","Monte","Santa Luzia","Santa Maria Maior","Santo António","São Gonçalo","São Martinho","São Pedro","São Roque","Sé"] },
  { name: "Machico",          freguesias: ["Água de Pena","Caniçal","Machico","Porto da Cruz","Santo António da Serra"] },
  { name: "Ponta do Sol",     freguesias: ["Canhas","Madalena do Mar","Ponta do Sol"] },
  { name: "Porto Moniz",      freguesias: ["Achadas da Cruz","Porto Moniz","Ribeira da Janela","Seixal"] },
  { name: "Porto Santo",      freguesias: ["Porto Santo"] },
  { name: "Ribeira Brava",    freguesias: ["Campanário","Ribeira Brava","Serra de Água","Tabua"] },
  { name: "Santa Cruz",       freguesias: ["Camacha","Caniço","Gaula","Santa Cruz","Santo António da Serra"] },
  { name: "Santana",          freguesias: ["Arco de São Jorge","Faial","Ilha","Santana","São Jorge"] },
  { name: "São Vicente",      freguesias: ["Boaventura","Ponta Delgada","São Vicente"] }
];

var WIKI = {
  "Arco da Calheta":"Arco_da_Calheta","Calheta":"Calheta,_Madeira","Estreito da Calheta":"Estreito_da_Calheta","Fajã da Ovelha":"Faj%C3%A3_da_Ovelha","Jardim do Mar":"Jardim_do_Mar","Paul do Mar":"Paul_do_Mar","Ponta do Pargo":"Ponta_do_Pargo","Prazeres":"Prazeres,_Madeira",
  "Câmara de Lobos":"C%C3%A2mara_de_Lobos,_Madeira","Curral das Freiras":"Curral_das_Freiras","Estreito de Câmara de Lobos":"Estreito_de_C%C3%A2mara_de_Lobos","Jardim da Serra":"Jardim_da_Serra,_Madeira","Quinta Grande":"Quinta_Grande,_Madeira",
  "Imaculado Coração de Maria":"Imaculado_Cora%C3%A7%C3%A3o_de_Maria,_Funchal","Monte":"Monte,_Madeira","Santa Luzia":"Santa_Luzia,_Funchal","Santa Maria Maior":"Santa_Maria_Maior,_Funchal","Santo António":"Santo_Ant%C3%B3nio,_Funchal","São Gonçalo":"S%C3%A3o_Gon%C3%A7alo,_Funchal","São Martinho":"S%C3%A3o_Martinho,_Funchal","São Pedro":"S%C3%A3o_Pedro,_Funchal","São Roque":"S%C3%A3o_Roque,_Funchal","Sé":"S%C3%A9,_Funchal",
  "Água de Pena":"%C3%81gua_de_Pena","Caniçal":"Cani%C3%A7al","Machico":"Machico,_Madeira","Porto da Cruz":"Porto_da_Cruz","Santo António da Serra":"Santo_Ant%C3%B3nio_da_Serra",
  "Canhas":"Canhas,_Madeira","Madalena do Mar":"Madalena_do_Mar","Ponta do Sol":"Ponta_do_Sol,_Madeira",
  "Achadas da Cruz":"Achadas_da_Cruz","Porto Moniz":"Porto_Moniz","Ribeira da Janela":"Ribeira_da_Janela","Seixal":"Seixal,_Madeira",
  "Porto Santo":"Porto_Santo",
  "Campanário":"Campon%C3%A1rio,_Madeira","Ribeira Brava":"Ribeira_Brava,_Madeira","Serra de Água":"Serra_de_%C3%81gua","Tabua":"Tabua,_Madeira",
  "Camacha":"Camacha,_Madeira","Caniço":"Cani%C3%A7o","Gaula":"Gaula,_Madeira","Santa Cruz":"Santa_Cruz,_Madeira",
  "Arco de São Jorge":"Arco_de_S%C3%A3o_Jorge","Faial":"Faial,_Madeira","Ilha":"Ilha,_Madeira","Santana":"Santana,_Madeira","São Jorge":"S%C3%A3o_Jorge,_Madeira",
  "Boaventura":"Boaventura,_Madeira","Ponta Delgada":"Ponta_Delgada,_Madeira","São Vicente":"S%C3%A3o_Vicente,_Madeira"
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
  inner.className = 'acc-body-inner';

  m.freguesias.forEach(function(f) {
    var a = document.createElement('a');
    a.href = 'https://en.wikipedia.org/wiki/' + (WIKI[f] || encodeURIComponent(f));
    a.target = '_blank';
    a.textContent = f;
    inner.appendChild(a);
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
