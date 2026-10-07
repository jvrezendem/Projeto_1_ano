# Frontend da aplicação ana.

Interface React/Vite da área privada implementada pelas Specs 001 e 002.

Inclui autenticação, história privada, navegação entre Inicial/Galeria/Perfil, temas claro e escuro, controle de movimento e drawer móvel acessível. A Galeria é uma superfície preparatória; upload, mapa interativo e popup pertencem às Specs 003/004.

## Pré-requisitos

- Node.js 20 ou superior
- Backend Spring Boot disponível em `http://localhost:8081`

## Desenvolvimento

```bash
npm install
npm run dev
```

O servidor Vite encaminha `/api` para o backend, mantendo as requisições de sessão e CSRF no mesmo host observado pelo navegador. Para desenvolvimento local, configure no `oneyear/.env`:

```properties
APP_COOKIE_SECURE=false
APP_CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

## Verificações

```bash
npm run lint
npm test
npm run build
```

As credenciais, os nomes, a história e os demais dados pessoais não ficam no bundle. Eles são provisionados no backend por configuração privada e o perfil e a história autenticados são obtidos pela API.
