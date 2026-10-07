# Frontend da aplicação ana.

Interface React/Vite da área privada implementada pelas Specs 001, 002 e 003.

Inclui autenticação, história privada, navegação entre Inicial/Galeria/Perfil, temas claro e escuro, controle de movimento, drawer móvel acessível e cadastro de uma foto por vez com prévia, upload e revisão de metadados. Mapa interativo, filtros cronológicos e popup pertencem à Spec 004.

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

As credenciais, os nomes, a história, as fotos e os demais dados pessoais não ficam no bundle. Eles são provisionados ou consultados pelo backend privado; a prévia do arquivo selecionado usa apenas uma URL local temporária do navegador.
