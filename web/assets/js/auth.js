import { http, setToken, getToken } from "./api.js";

/** Protege páginas após login */
export function requireAuth() {
  const token = getToken();
  if (!token) window.location.href = "index.html";
}

/** Faz login e guarda token */
export async function doLogin(email, senha) {
  const data = await fetch("http://localhost:3000/api/usuarios/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  }).then(r => r.json());

  if (!data?.token) throw new Error(data?.erro || "Credenciais inválidas");
  setToken(data.token);
}

/** Logout */
export function logout() {
  setToken(null);
  window.location.href = "index.html";
}

/** Healthcheck opcional */
export async function ping() {
  try { await http.get("/health"); } catch {}
}
