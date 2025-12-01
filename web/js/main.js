import { logout } from "./auth.js";

export function mountNavbar(active = "") {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  nav.innerHTML = `
    <div class="header">
      <div class="container wrap">
        <div class="brand">
          <div class="logo"></div>
          <h1>Smart Supply</h1>
        </div>
        <nav class="nav">
          <a href="dashboard.html" class="${active==='dashboard'?'active':''}">Dashboard</a>
          <a href="produtos.html" class="${active==='produtos'?'active':''}">Produtos</a>
          <a href="fornecedores.html" class="${active==='fornecedores'?'active':''}">Fornecedores</a>
          <a href="movimentacoes.html" class="${active==='movs'?'active':''}">Movimentações</a>
          <a href="#" id="logoutBtn">Sair</a>
        </nav>
      </div>
    </div>
  `;
  document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
    e.preventDefault(); logout();
  });
}
