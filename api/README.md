# Projeto SmartSupply
TCC - Desenvolvimento de Sistemas

## Tecnologias
- Node.JS
- VsCode
- Prisma
- JWT
- JavaScript

## Para instalar localmente
- Abra a API com o VsCode e em um terminal execute
```bash
npm i
```
- Crie o arquivo .env contendo
```js
DATABASE_URL="mysql://root@localhost:3306/SmartSupply?schema=public&timezone=UTC"
  # DATABASE_URL="mysql://user:senha@servidor:3306/dbname?schema=public&timezone=UTC"]
JWT_SECRET=sua_chave_secreta_aqui
PORT=3000
```
- Abra o XAMPP de Start no MySQL, altere o banco para MySQL em `prisma/schema.prisma` e execue a migração
```js
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```
- Execute a migração
```bash
npx prisma migrate dev --name init
```
## Autores

| Nome | Função |
| ---- | ------ |
| **Gabriel B. Zanon** | Desenvolvedor Full-Stack |
| **Lucas G. Giachetto** | Desenvolvedor Front-End|
| **Lucas M. Colombo** | Desenvolvedor Back-End |
| **Marcos V. Oliveira** | Engenheiro de Qualidade |
| **Kauê H. C. Fidellis** | Product Owner / Scrum Master |

---

## Licença
Projeto acadêmico – uso livre para fins de estudo. Credite os autores ao reutilizar.

---

<div align="center">

**Smart Supply** © 2025 &nbsp;·&nbsp; Todos os direitos reservados

</div>
