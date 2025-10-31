<div align="center">

# ðŸš€ CRUD Fullstack

### Sistema completo de gerenciamento de usuÃ¡rios com dashboard interativo

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)](https://vuejs.org/)
[![Nuxt](https://img.shields.io/badge/Nuxt-002E3B?style=for-the-badge&logo=nuxtdotjs&logoColor=#00DC82)](https://nuxt.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

<p align="center">
  <img src="https://img.shields.io/badge/Status-ConcluÃ­do-success?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/LicenÃ§a-MIT-blue?style=flat-square" alt="License">
</p>

</div>

---

## ðŸ“‹ Sobre o Projeto

Sistema **Fullstack** desenvolvido com foco em **performance**, **reatividade** e **experiÃªncia do usuÃ¡rio**. Implementa um CRUD completo com dashboard de mÃ©tricas em tempo real, interface moderna e responsiva.

### âœ¨ Destaques

```
âœ“ CRUD completo de usuÃ¡rios com validaÃ§Ãµes
âœ“ Dashboard com mÃ©tricas em tempo real
âœ“ Upload e preview de imagens
âœ“ AtualizaÃ§Ãµes reativas sem reload
âœ“ Interface moderna com ShadCN UI
âœ“ ContainerizaÃ§Ã£o com Docker
```

---

## ðŸ› ï¸ Stack TecnolÃ³gica

<table>
<tr>
<td width="50%" valign="top">

### ðŸ”· Backend
```yaml
Runtime:     Node.js + Express
Database:    SQLite (Better-SQLite3)
ID System:   UUID v4
Container:   Docker + Docker Compose
```

**CaracterÃ­sticas:**
- API RESTful completa
- PersistÃªncia em arquivo SQLite
- Endpoints otimizados
- ContainerizaÃ§Ã£o isolada

</td>
<td width="50%" valign="top">

### ï¿½ Frontend
```yaml
Framework:   Nuxt 3 (Vue 3)
State:       Pinia Store
UI Kit:      ShadCN Vue + Tailwind
Charts:      Chart.js + Vue-ChartJS
Icons:       Lucide Icons
```

**CaracterÃ­sticas:**
- SSR/SSG com Nuxt 3
- Composables e reatividade
- Design system consistente
- Componentes reutilizÃ¡veis

</td>
</tr>
</table>

---

## ðŸŽ¯ Funcionalidades

<table>
<tr>
<td width="25%">

### ðŸ‘¥ GestÃ£o de UsuÃ¡rios
- Criar usuÃ¡rios
- Editar perfis
- Excluir registros
- ValidaÃ§Ã£o de dados
- Upload de avatar

</td>
<td width="25%">

### ï¿½ Dashboard
- Total de usuÃ¡rios
- Novos cadastros
- MÃ©dia de idade
- GrÃ¡fico temporal
- Atividades recentes

</td>
<td width="25%">

### ðŸŽ¨ Interface
- Design responsivo
- Dark mode ready
- Modais e dialogs
- Tabelas interativas
- Sidebar navegÃ¡vel

</td>
<td width="25%">

### âš¡ Performance
- Estado global Pinia
- Cache inteligente
- Lazy loading
- Updates em tempo real
- Zero reload

</td>
</tr>
</table>  

---

## ðŸ³ InÃ­cio RÃ¡pido com Docker

### PrÃ©-requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

### Executando o projeto

```bash
# Clone o repositÃ³rio
git clone https://github.com/gamarques/crud-teste.git
cd crud-teste

# Suba os containers
docker compose up --build
```

### ðŸŒ Acesso aos ServiÃ§os

| ServiÃ§o | Porta | URL | DescriÃ§Ã£o |
|---------|-------|-----|-----------|
| ðŸŽ¨ **Frontend** | `3000` | http://localhost:3000 | AplicaÃ§Ã£o Nuxt 3 |
| âš™ï¸ **Backend API** | `4000` | http://localhost:4000/api | API REST |

<details>
<summary>ðŸ“¦ ConfiguraÃ§Ã£o do Docker Compose</summary>

```yaml
version: '3.9'

services:
  backend:
    build: ./backend
    container_name: API_backend
    ports:
      - "4000:4000"
    volumes:
      - ./backend/data:/app/data
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  frontend:
    build: ./frontend
    container_name: Frontend_app
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - NODE_ENV=production
      - NUXT_PUBLIC_API_URL=http://localhost:4000/api
    restart: unless-stopped
```

</details>

---

## ðŸ’» Executando Localmente (sem Docker)

<details>
<summary><b>ï¿½ Backend</b></summary>

```bash
cd backend
npm install
npm start
```

âœ… Servidor rodando em `http://localhost:4000/api`

</details>

<details>
<summary><b>ðŸŽ¨ Frontend</b></summary>

```bash
cd frontend
npm install
npm run dev
```

âœ… AplicaÃ§Ã£o disponÃ­vel em `http://localhost:3000`

</details>

---

## ðŸ“¡ API Endpoints

<table>
<thead>
<tr>
<th>MÃ©todo</th>
<th>Endpoint</th>
<th>DescriÃ§Ã£o</th>
<th>Body/Params</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>GET</code></td>
<td><code>/api/users</code></td>
<td>Lista todos os usuÃ¡rios</td>
<td>-</td>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/api/users/:id</code></td>
<td>Busca usuÃ¡rio especÃ­fico</td>
<td><code>:id</code></td>
</tr>
<tr>
<td><code>POST</code></td>
<td><code>/api/users</code></td>
<td>Cria novo usuÃ¡rio</td>
<td>JSON body</td>
</tr>
<tr>
<td><code>PUT</code></td>
<td><code>/api/users/:id</code></td>
<td>Atualiza usuÃ¡rio</td>
<td><code>:id</code> + JSON body</td>
</tr>
<tr>
<td><code>DELETE</code></td>
<td><code>/api/users/:id</code></td>
<td>Remove usuÃ¡rio</td>
<td><code>:id</code></td>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/api/users/new</code></td>
<td>Retorna novos usuÃ¡rios</td>
<td>-</td>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/api/users/age</code></td>
<td>Retorna mÃ©dia de idade</td>
<td>-</td>
</tr>
</tbody>
</table>

### Exemplo de Request

```json
POST /api/users
{
  "name": "Gabriel Marques",
  "email": "gabriel@example.com",
  "password": "senha123",
  "cpf": "123.456.789-00",
  "birthDate": "1990-01-15",
  "avatar": "data:image/png;base64,..."
}
```

---

## ðŸ—‚ï¸ Estrutura do Projeto

```
ðŸ“¦ crud-teste
â”œâ”€â”€ ðŸ“‚ backend/
â”‚   â”œâ”€â”€ ðŸ“‚ src/
â”‚   â”‚   â””â”€â”€ ðŸ“„ index.js          # Express server + Routes
â”‚   â”œâ”€â”€ ðŸ“‚ data/                 # SQLite database (persistent)
â”‚   â”œâ”€â”€ ðŸ“„ Dockerfile
â”‚   â””â”€â”€ ðŸ“„ package.json
â”‚
â”œâ”€â”€ ðŸ“‚ frontend/
â”‚   â”œâ”€â”€ ðŸ“‚ components/
â”‚   â”‚   â”œâ”€â”€ ðŸ“‚ charts/          # Chart components
â”‚   â”‚   â”œâ”€â”€ ðŸ“‚ ui/              # ShadCN components
â”‚   â”‚   â””â”€â”€ ðŸ“‚ user/            # User-specific components
â”‚   â”œâ”€â”€ ðŸ“‚ pages/               # Nuxt pages (routing)
â”‚   â”œâ”€â”€ ðŸ“‚ store/               # Pinia stores
â”‚   â”œâ”€â”€ ðŸ“‚ layouts/             # App layouts
â”‚   â”œâ”€â”€ ðŸ“‚ plugins/             # Nuxt plugins
â”‚   â”œâ”€â”€ ðŸ“„ nuxt.config.ts
â”‚   â””â”€â”€ ðŸ“„ Dockerfile
â”‚
â””â”€â”€ ðŸ“„ docker-compose.yml        # Orchestration
```

---

## ðŸ’¾ Banco de Dados

### Schema SQLite

```sql
CREATE TABLE users (
  id         TEXT PRIMARY KEY,      -- UUID v4
  name       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  cpf        TEXT,
  birthDate  TEXT,
  avatar     TEXT,                  -- Base64 ou path
  createdAt  TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt  TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### CaracterÃ­sticas

- âœ… Banco embarcado (zero configuraÃ§Ã£o)
- âœ… PersistÃªncia garantida via volume Docker
- âœ… Suporte a transaÃ§Ãµes ACID
- âœ… Backup facilitado (arquivo Ãºnico)

---

##  Gerenciamento de Estado (Pinia)

### Arquitetura Reativa

```typescript
// store/users.ts
export const useUserStore = defineStore('users', {
  state: () => ({
    list: [],           // Lista de usuários
    newUsers: [],       // Usuários recentes
    averageAge: 0,      // Média de idade
    activities: [],     // Log de atividades
    loading: false
  }),
  
  actions: {
    async fetch(force = false) {
      // Cache inteligente - evita requisições desnecessárias
      if (this.list.length && !force) return
      const data = await $fetch('/api/users')
      this.list = data
    }
  }
})
```

### Benefícios

| Recurso | Descrição |
|---------|-----------|
|  **Reatividade** | Updates automáticos em todos os componentes |
|  **Cache** | Evita requisições redundantes |
|  **Performance** | Estado centralizado e otimizado |
|  **Modularidade** | Stores desacopladas e testáveis |

---

##  Sistema de Design

### Componentes ShadCN Vue

```
 Button        Card          Dialog       Input
 Table         Avatar        Sidebar      Sheet
 Skeleton      Toast         Tooltip      Separator
```

### Temas e Customização

-  Baseado em variáveis CSS
-  Dark mode ready
-  Totalmente responsivo
-  Acessibilidade (ARIA)

---

##  Dashboard e Métricas

### Cards de Estatísticas

```vue
 Total de Usuários       Contagem geral
 Novos Usuários          Cadastros recentes
 Média de Idade          Cálculo dinâmico
 Gráfico Temporal        Chart.js integration
 Atividades Recentes     Log em tempo real
```

### Atualização Automática

-  Após criar usuário
-  Após editar usuário
-  Após excluir usuário
-  Sem necessidade de reload

---

##  Boas Práticas Implementadas

<table>
<tr>
<td width="50%">

###  Código Limpo
-  Nomenclatura descritiva
-  Funções pequenas e focadas
-  Comentários quando necessário
-  Padrões consistentes

###  Arquitetura
-  Separação de responsabilidades
-  Componentes reutilizáveis
-  Store centralizada
-  API RESTful

</td>
<td width="50%">

###  Performance
-  Lazy loading de componentes
-  Cache inteligente
-  Debounce em inputs
-  Otimização de builds

###  Segurança
-  Validação de dados
-  Sanitização de inputs
-  CORS configurado
-  Environment variables

</td>
</tr>
</table>

---

##  Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Adicionar testes unitários (Vitest)
- [ ] Criar sistema de permissões
- [ ] Adicionar paginação na tabela
- [ ] Implementar busca e filtros avançados
- [ ] Deploy em produção (Vercel + Railway)

---

##  Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

##  Autor

<div align="center">

### Gabriel Marques

[![GitHub](https://img.shields.io/badge/GitHub-gamarques-181717?style=for-the-badge&logo=github)](https://github.com/gamarques)
[![Portfolio](https://img.shields.io/badge/Portfolio-gamarques.vercel.app-000?style=for-the-badge&logo=vercel)](https://gamarques.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/gamarques)

---

** Se este projeto foi útil, considere dar uma estrela!**

</div>
