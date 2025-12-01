// ----------------------
// URL correta da API (sem /api no final)
// ----------------------
const API_URL = "https://api-projeto-kappa.vercel.app";

// ----------------------
// Controle do Token
// ----------------------
export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

// ----------------------
// Tratamento de falhas
// ----------------------
function handleAuthFailure(res) {
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  }
}

// ----------------------
// Função principal de requisições
// ----------------------
export async function api(path, { method = "GET", body, headers = {} } = {}) {
  const token = getToken();
  const opts = {
    method,
    headers: { "Content-Type": "application/json", ...headers },
  };

  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_URL}${path}`, opts);
  if (!res.ok) handleAuthFailure(res);

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok)
    throw new Error(data?.error || data?.erro || `HTTP ${res.status}`);

  return data;
}

// ----------------------
// Atalhos para facilitar uso
// ----------------------
export const http = {
  get: (p) => api(p),
  post: (p, b) => api(p, { method: "POST", body: b }),
  put: (p, b) => api(p, { method: "PUT", body: b }),
  del: (p) => api(p, { method: "DELETE" }),
};
