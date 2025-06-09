// js/api.js

function obterDados(chave) {
  return JSON.parse(localStorage.getItem(chave)) || [];
}

function salvarDados(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

function adicionarItem(chave, item) {
  const dados = obterDados(chave);
  item.id = gerarId(dados);
  dados.push(item);
  salvarDados(chave, dados);
}

function gerarId(lista) {
  return lista.length > 0 ? lista[lista.length - 1].id + 1 : 1;
}

function preencherSelect(idSelect, chave, campoTexto) {
  const select = document.getElementById(idSelect);
  const lista = obterDados(chave);
  select.innerHTML = "";
  lista.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = item[campoTexto];
    select.appendChild(opt);
  });
}
