var MUNICIPALITIES = [
  { name: "Calheta",          freguesias: ["Arco da Calheta","Calheta","Estreito da Calheta","Fajã da Ovelha","Jardim do Mar","Paul do Mar","Ponta do Pargo","Prazeres"] },
  { name: "Câmara de Lobos",  freguesias: ["Câmara de Lobos","Curral das Freiras","Estreito de Câmara de Lobos","Jardim da Serra","Quinta Grande"] },
  { name: "Funchal",          freguesias: ["Imaculado Coração de Maria","Monte","Santa Luzia","Santa Maria Maior","Santo António","São Gonçalo","São Martinho","São Pedro","São Roque","Sé"] },
  { name: "Machico",          freguesias: ["Água de Pena","Caniçal","Machico","Porto da Cruz","Santo António da Serra (Machico)"] },
  { name: "Ponta do Sol",     freguesias: ["Canhas","Madalena do Mar","Ponta do Sol"] },
  { name: "Porto Moniz",      freguesias: ["Achadas da Cruz","Porto Moniz","Ribeira da Janela","Seixal"] },
  { name: "Porto Santo",      freguesias: ["Porto Santo"] },
  { name: "Ribeira Brava",    freguesias: ["Campanário","Ribeira Brava","Serra de Água","Tabua"] },
  { name: "Santa Cruz",       freguesias: ["Camacha","Caniço","Gaula","Santa Cruz","Santo António da Serra (Santa Cruz)"] },
  { name: "Santana",          freguesias: ["Arco de São Jorge","Faial","Ilha","Santana","São Jorge"] },
  { name: "São Vicente",      freguesias: ["Boaventura","Ponta Delgada","São Vicente"] }
];

var WIKI = {
  // Calheta
  "Arco da Calheta":                    "Arco_da_Calheta",
  "Calheta":                            "Calheta,_Madeira",
  "Estreito da Calheta":                "Estreito_da_Calheta",
  "Fajã da Ovelha":                     "Faj%C3%A3_da_Ovelha",
  "Jardim do Mar":                      "Jardim_do_Mar",
  "Paul do Mar":                        "Paul_do_Mar",
  "Ponta do Pargo":                     "Ponta_do_Pargo",
  "Prazeres":                           "Prazeres,_Madeira",
  // Câmara de Lobos
  "Câmara de Lobos":                    "C%C3%A2mara_de_Lobos,_Madeira",
  "Curral das Freiras":                 "Curral_das_Freiras",
  "Estreito de Câmara de Lobos":        "Estreito_de_C%C3%A2mara_de_Lobos",
  "Jardim da Serra":                    "Jardim_da_Serra",
  "Quinta Grande":                      "Quinta_Grande",
  // Funchal
  "Imaculado Coração de Maria":         "Imaculado_Cora%C3%A7%C3%A3o_de_Maria",
  "Monte":                              "Monte_(Funchal)",
  "Santa Luzia":                        "Santa_Luzia_(Funchal)",
  "Santa Maria Maior":                  "Santa_Maria_Maior_(Funchal)",
  "Santo António":                      "Santo_Ant%C3%B3nio_(Funchal)",
  "São Gonçalo":                        "S%C3%A3o_Gon%C3%A7alo_(Funchal)",
  "São Martinho":                       "S%C3%A3o_Martinho_(Funchal)",
  "São Pedro":                          "S%C3%A3o_Pedro_(Funchal)",
  "São Roque":                          "S%C3%A3o_Roque_(Funchal)",
  "Sé":                                 "S%C3%A9_(Funchal)",
  // Machico
  "Água de Pena":                       "%C3%81gua_de_Pena",
  "Caniçal":                            "Cani%C3%A7al",
  "Machico":                            "Machico,_Madeira",
  "Porto da Cruz":                      "Porto_da_Cruz",
  "Santo António da Serra (Machico)":   "Santo_Ant%C3%B3nio_da_Serra_(Machico)",
  // Ponta do Sol
  "Canhas":                             "Canhas",
  "Madalena do Mar":                    "Madalena_do_Mar",
  "Ponta do Sol":                       "Ponta_do_Sol,_Madeira",
  // Porto Moniz
  "Achadas da Cruz":                    "Achadas_da_Cruz",
  "Porto Moniz":                        "Porto_Moniz",
  "Ribeira da Janela":                  "Ribeira_da_Janela",
  "Seixal":                             "Seixal_(Porto_Moniz)",
  // Porto Santo
  "Porto Santo":                        "Porto_Santo",
  // Ribeira Brava
  "Campanário":                         "Campan%C3%A1rio,_Madeira",
  "Ribeira Brava":                      "Ribeira_Brava,_Madeira",
  "Serra de Água":                      "Serra_de_%C3%81gua",
  "Tábua":                              "Tabua,_Madeira",
  // Santa Cruz
  "Camacha":                            "Camacha",
  "Caniço":                             "Cani%C3%A7o",
  "Gaula":                              "Gaula_(Madeira)",
  "Santa Cruz":                         "Santa_Cruz,_Madeira",
  "Santo António da Serra":             "Santo_Ant%C3%B3nio_da_Serra_(Santa_Cruz)",
  // Santana
  "Arco de São Jorge":                  "Arco_de_S%C3%A3o_Jorge",
  "Faial":                              "Faial(Santana)",
  "Ilha":                               "Ilha_(Santana)",
  "Santana":                            "Santana,_Madeira",
  "São Jorge":                          "S%C3%A3o_Jorge_(Santana)",
  // São Vicente
  "Boaventura":                         "Boaventura,_S%C3%A3o_Vicente",
  "Ponta Delgada":                      "Ponta_Delgada,_S%C3%A3o_Vicente",
  "São Vicente":                        "S%C3%A3o_Vicente,_Madeira"
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
    a.textContent = f.replace(' (Machico)', '').replace(' (Santa Cruz)', '');
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
