# Frontend da aplicação ana.

Interface React/Vite da área privada implementada pelas Specs 001, 002, 003 e 004.

Inclui autenticação, história privada, navegação entre Inicial/Galeria/Perfil, temas claro e escuro, controle de movimento, drawer móvel acessível, cadastro de fotos, mapa Leaflet com pins de coração, lista alternativa, detalhe compartilhado e galeria cronológica paginada com filtro por ano.

O mapa usa tiles do OpenStreetMap com atribuição visível. O provedor recebe apenas as coordenadas públicas dos tiles solicitados pelo viewport; fotos, legendas, credenciais e dados da API não são enviados. Se os tiles falharem, a lista de memórias e a galeria continuam utilizáveis.

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
