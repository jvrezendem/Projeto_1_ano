# Project Context — Projeto 1Ano

## Estado atual

- Data da implementação: 2026-10-05.
- Spec executada: `SPEC-1ANO-005 - Backend Spring Boot e contratos REST`.
- Regras aplicadas: `Regras para IA.md`.
- Branch criada e usada: `develop`.
- Backend localizado em `oneyear/`.
- Pacote Java adotado: `com.ano.project`.
- Java: 21.
- Spring Boot: 4.1.1, versão estável vigente na data da implementação.
- Resultado final da validação: `BUILD SUCCESS`, com 14 testes aprovados, nenhuma falha e nenhum erro.
- Artefato gerado localmente: `oneyear/target/oneyear-0.0.1-SNAPSHOT.jar` (arquivo ignorado pelo Git).

## Decisões técnicas materializadas

- API REST com prefixo `/api/v1` e controllers sem renderização de páginas.
- Sessão mantida no servidor por cookie, com 30 minutos de inatividade.
- Spring Security com autenticação das duas contas, CSRF para escritas, CORS restrito, BCrypt e respostas JSON uniformes para 401/403.
- PostgreSQL para dados relacionais, com schema versionado por Flyway.
- Neon Object Storage privado, por sua interface compatível com S3, para imagens e avatares.
- AWS SDK for Java 2.55.7 como cliente S3.
- Metadata Extractor 2.20.0 para GPS, data, hora e offset EXIF.
- JPEG e PNG, no máximo 15 MiB e 40 milhões de pixels.
- H2 somente nos testes automatizados; não é fallback de produção.
- Nenhuma credencial, senha, token, foto ou conteúdo pessoal foi colocado no repositório.

Fontes verificadas durante a implementação:

- [Spring Boot 4.1.1](https://spring.io/blog/2026/08/20/spring-boot-4-1-1-available-now/)
- [Requisitos de sistema do Spring Boot 4.1.1](https://docs.spring.io/spring-boot/system-requirements.html)
- [Neon Object Storage](https://neon.com/blog/building-neon-object-storage)
- [AWS SDK for Java com Maven](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/setup-project-maven.html)

## Estrutura implementada

O esqueleto inicial `com.project.oneyear` foi substituído pelo pacote definido na spec. A estrutura Java ficou limitada às pastas MVC solicitadas:

```text
oneyear/src/main/java/com/ano/project/
├── ProjectApplication.java
├── config/
│   ├── AplicacaoProperties.java
│   ├── ArmazenamentoConfig.java
│   ├── SecurityConfig.java
│   └── UsuariosIniciaisConfig.java
├── controller/
│   ├── AuthController.java
│   ├── PerfilController.java
│   ├── HistoriaController.java
│   ├── FotoController.java
│   └── contratos REST em records/classes próximos aos controllers
├── database/
│   ├── models/Usuario.java
│   ├── models/Foto.java
│   ├── repository/IUsuarioRepository.java
│   └── repository/IFotoRepository.java
├── exception/ApiException.java
├── handler/GlobalExceptionHandler.java
└── service/
    ├── UsuarioService.java
    ├── HistoriaService.java
    ├── FotoService.java
    ├── MetadadosService.java
    ├── ArmazenamentoService.java
    ├── ReconciliacaoService.java
    └── TentativasLoginService.java
```

Não foram criadas pastas Java adicionais como `dto`, `security` ou `storage`. Os nomes de domínio, classes e métodos foram mantidos em português e em camelCase. Os repositórios seguem o padrão com prefixo `I` definido nas regras.

## Dependências e build

O `pom.xml` foi ajustado para manter apenas as dependências usadas:

- Spring Web MVC, Security, Validation e Data JPA;
- Flyway e módulo PostgreSQL do Flyway;
- driver PostgreSQL;
- Metadata Extractor 2.20.0;
- AWS SDK S3 e cliente HTTP por URL Connection 2.55.7;
- Lombok;
- módulos de teste Web MVC e Security;
- H2 em escopo de teste.

Foi removido o DevTools e foram removidos starters de teste que não eram necessários. A aplicação principal anterior e o teste vazio do Initializr também foram removidos ao migrar o pacote.

## Persistência

Foi criada a migração `V1__criar_usuarios_e_fotos.sql` com:

- tabela `usuarios`;
- tabela `usuario_caracteristicas`;
- tabela `fotos`;
- chaves UUID geradas na aplicação;
- login, `storage_key` e avatar únicos;
- vínculo obrigatório entre foto e autor;
- limites de tamanho de campos;
- coordenadas simultaneamente nulas ou simultaneamente válidas;
- origens `EXIF`, `MANUAL` e `AUSENTE`;
- instantes de criação e atualização;
- índices para galeria cronológica e pins.

O JPA usa `ddl-auto: validate` em execução normal, e o Flyway é a fonte do schema. A galeria é ordenada por data de captura crescente, nulos ao final, criação e ID. O filtro anual e a lista de anos consultam a coleção completa. Pins são paginados separadamente e ordenados por ID.

## Duas contas predefinidas

`UsuariosIniciaisConfig`:

- exige duas configurações completas e logins diferentes;
- falha na inicialização se o estado resultante não tiver exatamente duas contas;
- cria somente contas ausentes;
- não sobrescreve hashes nem perfis já existentes;
- não existe endpoint de cadastro de usuário;
- normaliza campos opcionais vazios para `null`.

Hashes BCrypt e conteúdos de perfil entram somente por configuração externa.

## Segurança implementada

- Conteúdo pessoal, imagens e avatares exigem autenticação.
- Somente `/auth/csrf`, `/auth/login` e o logout idempotente são públicos.
- Escritas exigem token CSRF válido.
- Login renova o identificador da sessão e nunca devolve senha ou hash.
- Logout invalida sessão e cookie; uma sessão já expirada pode receber 204 com CSRF válido.
- Cookie `HttpOnly`, `SameSite=Lax` e `Secure` por padrão em produção.
- CORS aceita apenas origens configuradas e mantém credenciais.
- Cinco falhas de login em 15 minutos bloqueiam temporariamente a chave de tentativa e devolvem 429.
- Respostas privadas recebem os headers de não armazenamento em cache do Spring Security.
- Erros de segurança e de controllers usam `codigo`, `mensagem`, `campos` e `traceId`.
- Logs registram operação, status e identificadores técnicos, sem senha, token, bytes ou GPS detalhado.

## Contratos REST implementados

| Método | Caminho | Resultado principal |
|---|---|---|
| GET | `/api/v1/auth/csrf` | token e nome do header CSRF |
| POST | `/api/v1/auth/login` | perfil e sessão |
| POST | `/api/v1/auth/logout` | 204 e sessão invalidada |
| GET | `/api/v1/me` | perfil atual |
| GET | `/api/v1/me/avatar` | avatar privado ou 404 |
| GET | `/api/v1/historia` | história privada configurada externamente |
| POST | `/api/v1/fotos` | upload multipart e resposta 201 com `Location` |
| GET | `/api/v1/fotos` | galeria paginada e filtro opcional por ano |
| GET | `/api/v1/fotos/anos` | anos distintos em ordem crescente |
| GET | `/api/v1/fotos/pins` | pins paginados |
| GET | `/api/v1/fotos/{id}` | detalhe da memória |
| GET | `/api/v1/fotos/{id}/arquivo` | binário privado |
| PATCH | `/api/v1/fotos/{id}` | correção parcial de legenda, lugar, coordenadas e data |

Paginação começa em zero, usa 24 itens por padrão na galeria, 100 nos pins e limita `size` a 100. Página além do final retorna lista vazia. Rotas `/anos` e `/pins` não são tratadas como UUID.

O PATCH diferencia campo ausente de campo explicitamente nulo. Campo ausente é preservado; `null` limpa. Latitude e longitude precisam ser enviadas juntas. Corrigir a data manualmente elimina a hora e o offset EXIF anteriores.

## Imagens, EXIF e consistência

- O tipo real é validado pela assinatura do arquivo; o `Content-Type` enviado pelo cliente não é confiado.
- O leitor verifica largura, altura e total de pixels antes da decodificação completa.
- Imagem corrompida retorna 422, tipo não aceito retorna 415 e excesso de tamanho retorna 413.
- GPS EXIF é convertido para decimal, preservando sul/oeste negativos.
- A data original, hora e offset são lidos separadamente; fuso ausente não é inventado.
- Metadado ausente ou inválido produz campos nulos e aviso sem impedir uma imagem decodificável.
- Data de envio é mantida separada da data de captura.
- Arquivos são gravados com chave UUID, sem reutilizar o nome fornecido pelo cliente.
- Se o banco falhar depois do armazenamento, o serviço tenta remover o objeto imediatamente.
- Se o storage falhar, nenhum registro de foto é confirmado.
- Uma rotina diária remove objetos com mais de 24 horas que não possuem registro no banco.
- O bucket continua privado; arquivos são entregues apenas pelo backend autenticado.

## Configuração externa necessária

Nenhum valor sensível possui padrão versionado. Antes de iniciar a aplicação fora dos testes, configurar:

| Variável | Uso |
|---|---|
| `DATABASE_URL` | URL JDBC do PostgreSQL/Neon |
| `DATABASE_USERNAME` | usuário do banco, se não estiver na URL |
| `DATABASE_PASSWORD` | senha do banco, se não estiver na URL |
| `NEON_STORAGE_ENDPOINT` | endpoint S3 compatível do Neon Object Storage |
| `NEON_STORAGE_REGION` | região; padrão `us-east-2` |
| `NEON_STORAGE_BUCKET` | bucket privado |
| `NEON_STORAGE_ACCESS_KEY` | chave de acesso |
| `NEON_STORAGE_SECRET_KEY` | chave secreta |
| `USUARIO_1_*` e `USUARIO_2_*` | login, hash BCrypt, nome e perfil das duas contas |
| `HISTORIA_*` | frase, introdução e dicas não pessoais no repositório |
| `APP_PRIVATE_CONFIG` | arquivo YAML externo opcional para seções completas da história |
| `APP_CORS_ALLOWED_ORIGINS` | origens explícitas do frontend |
| `APP_COOKIE_SECURE` | deve permanecer `true` em HTTPS; usar `false` somente em desenvolvimento HTTP |

Para a história com seções, o arquivo indicado por `APP_PRIVATE_CONFIG` pode preencher `app.historia.secoes` com `id`, `ordem`, `titulo`, `texto`, `data` e `fotoId` sem publicar conteúdo pessoal no Git.

## Testes implementados

Arquivos de teste:

- `ApiIntegrationTest`: segurança anônima, CSRF, credenciais inválidas, login, perfil, avatar presente/ausente, história, logout autenticado e expirado, upload, galeria, anos, pins, detalhe, arquivo, PATCH, nulos explícitos, paginação, coordenadas e tipo inválidos.
- `UsuariosIniciaisConfigTest`: criação exata das duas contas, idempotência e configuração incompleta.
- `ArmazenamentoServiceTest`: salvar, buscar, remover, listar, 404 e indisponibilidade do storage.
- `FotoServiceTest`: compensação quando o banco falha e ausência de persistência quando o storage falha.
- `MetadadosServiceTest`: imagem sem EXIF e metadado ilegível.
- `ReconciliacaoServiceTest`: remoção apenas de órfão com mais de 24 horas.
- `TentativasLoginServiceTest`: bloqueio após cinco falhas e liberação após sucesso.

Comando final executado:

```powershell
mvn clean verify
```

Resultado:

```text
Tests run: 14, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

Também foram executados `git diff --check`, compilação limpa e busca por credenciais. Foram encontrados apenas nomes de propriedades e placeholders de ambiente, sem valores sensíveis.

## Arquivos alterados e adicionados

- Atualizado `oneyear/pom.xml`.
- Substituído `oneyear/src/main/resources/application.yaml`.
- Removidos a classe principal e o teste vazio em `com.project.oneyear`.
- Adicionados 32 arquivos Java de produção em `com.ano.project`.
- Adicionada uma migração Flyway.
- Adicionados sete arquivos de teste.
- Preenchido este `Project Context.md` com o registro integral da execução.

## Pendências externas e limites desta execução

- Não foi possível executar contra uma instância Neon real porque credenciais, bucket e URL do banco não foram fornecidos, e as regras proíbem inventá-los ou versioná-los.
- Os dois logins, hashes BCrypt, perfis, avatares e a história real ainda precisam ser fornecidos externamente pelo autor.
- A migração foi revisada e o modelo foi exercitado por H2 em modo PostgreSQL, mas a aplicação da migration em Neon/PostgreSQL real deve fazer parte da configuração do ambiente.
- Na execução da Spec 005 não houve publicação, contratação de serviço ou alteração do frontend; a implementação posterior do frontend está registrada abaixo na execução da Spec 001.
- O provedor de mapa continua sendo uma decisão do frontend; o backend já entrega coordenadas e pins conforme o contrato.
- A execução dos testes mostra um aviso do Mockito sobre carregamento dinâmico de agente em versões futuras do JDK. Ele não causou falha no Java 21 usado e não afeta o código de produção.

## Configuração privada local

- Criado `oneyear/config/private.yaml`, apontado por `APP_PRIVATE_CONFIG`, com a estrutura válida de `app.historia.secoes` e lista inicialmente vazia.
- Nenhum texto, data, foto ou fato pessoal foi inventado; o conteúdo real deve ser preenchido pelo autor.
- Adicionado `config/private.yaml` ao `.gitignore` do backend para impedir o versionamento acidental da história privada.
- Adicionado o `spring-boot-configuration-processor` ao build para gerar metadados das propriedades `app.*` e eliminar o aviso incorreto de propriedade desconhecida no `application.yaml`.

# Execução da SPEC-1ANO-001 — Autenticação e perfis

## Estado e escopo

- Data da implementação e validação: 2026-10-06.
- Spec executada: `SPEC-1ANO-001 - Autenticação e perfis`, atualizada para o estado `implementado`, versão 1.0.
- Regras aplicadas: `Regras para IA.md`.
- Branch usada: `develop`.
- Frontend implementado em `oneyear/frontend/`, com React 19, Vite 7.3.7, Geist e ícones Lucide.
- Backend de autenticação da Spec 005 reaproveitado e seus testes ampliados para cobrir integralmente a Spec 001.
- Não foram implementados cadastro, recuperação de senha, login social, edição de perfil ou papéis administrativos, pois estão fora do escopo.

## Decisões confirmadas

- Sessão mantida no servidor pelo Spring Security, com cookie `HttpOnly`, `SameSite=Lax`, `Secure` por padrão e expiração após 30 minutos de inatividade.
- Fluxo de escrita protegido por CSRF: obtenção do token, login, renovação do token após autenticar e logout autenticado.
- Exatamente duas contas provisionadas por configuração privada; não existe rota nem interface de cadastro.
- Login e senha incorretos retornam a mesma mensagem genérica, sem revelar se uma conta existe.
- O frontend usa apenas memória para nome, avatar, descrição e características. Nenhum dado pessoal, credencial ou hash foi incluído no bundle.
- A interface consulta o perfil em `/api/v1/me`, trata 401 como sessão ausente/expirada e retorna ao login.
- Ao sair, os dados privados são removidos da interface imediatamente. Se a rede falhar, a interface informa a falta de confirmação e repete a invalidação quando a conexão retorna.
- A aplicação revalida a sessão ao recuperar foco e ao voltar pelo histórico do navegador; as chamadas privadas usam `cache: no-store` e o backend envia proteção contra cache.
- Em desenvolvimento, o Vite encaminha `/api` para `http://localhost:8080`, permitindo o uso de cookies no mesmo host percebido pelo navegador. Em produção, frontend e API devem permanecer sob HTTPS e mesma origem, conforme definido na spec.

## Interface implementada

- Tela de login com campos identificados, validação de obrigatoriedade, exibição/ocultação de senha, estado de envio e mensagem genérica de falha.
- Página principal privada simples para confirmar a entrada bem-sucedida e oferecer acesso ao perfil.
- Perfil próprio com nome, avatar privado ou iniciais como fallback, descrição vazia segura e lista de características.
- Sidebar desktop e painel móvel com Principal, Perfil e Sair. Galeria aparece desabilitada porque pertence a specs posteriores.
- Menu móvel com backdrop, fechamento por clique ou `Escape`, foco inicial no primeiro item e devolução do foco ao botão que abriu o menu.
- Layout responsivo sem rolagem horizontal nos viewports verificados, foco visível, regiões e rótulos acessíveis, contraste adequado e respeito a `prefers-reduced-motion`.

## Direção visual e recursos

O frontend existente indicado nas regras foi analisado e sua linguagem foi preservada: marca `ana.`, fundos branco e azul-marinho, azul vivo como ação principal, vermelho como acento afetivo, Geist, grandes títulos editoriais, bordas discretas e navegação lateral.

Foram gerados e versionados dois conceitos visuais de referência:

- `oneyear/frontend/design-references/spec001-login.png`;
- `oneyear/frontend/design-references/spec001-perfil.png`.

Também foi criada a arte abstrata sem dados pessoais `oneyear/frontend/public/login-memories.png`, usada no painel direito do login. Campos, botões, navegação e conteúdo do perfil permanecem em HTML/CSS e não foram incorporados na imagem.

### Registro de fidelidade visual

| Ponto comparado | Resultado na renderização final |
|---|---|
| Composição do login | Divisão equilibrada entre formulário claro e arte azul-marinho, preservando a leitura do conceito. |
| Hierarquia tipográfica | Marca compacta, título editorial dominante, texto auxiliar e rótulos mantêm a mesma ordem visual. |
| Cores e acentos | Azul-marinho, branco, azul de ação e vermelho afetivo foram mantidos de forma consistente. |
| Formulário | Campos largos, botão primário arredondado, foco visível e mensagem de erro acessível seguem o conceito. |
| Perfil desktop | Sidebar fixa, título grande, avatar, identidade e características reproduzem a estrutura aprovada. |
| Navegação móvel | Painel lateral contém marca, itens, estado ativo e ação Sair, como no conceito; o fundo recebe overlay. |
| Responsividade | A composição foi adaptada para 375×812 sem comprimir controles, truncar textos ou criar overflow horizontal. |

## Arquivos adicionados e alterados

Frontend adicionado:

- configuração: `package.json`, `package-lock.json`, `vite.config.js`, `eslint.config.js`, `index.html` e `README.md`;
- aplicação: `src/main.jsx`, `src/App.jsx`, `src/api.js` e `src/styles.css`;
- componentes: `Button.jsx`, `LoginPage.jsx`, `HomePage.jsx`, `ProfilePage.jsx` e `Sidebar.jsx`;
- teste: `test/api.test.js`;
- referências e arte: os três arquivos PNG descritos acima.

Backend e documentação alterados:

- `ApiIntegrationTest.java`: adicionada autenticação determinística da segunda conta, igualdade da resposta genérica para login inexistente e senha errada, verificação de `no-store`, invalidação real da sessão após logout e isolamento entre perfis;
- `UsuariosIniciaisConfigTest.java`: adicionada rejeição de logins duplicados;
- `oneyear/.gitignore`: adicionados `frontend/node_modules/` e `frontend/dist/`, mantendo `.env` e arquivos privados fora do Git;
- `oneyear/src/main/resources/application.yaml`: mantida a importação segura do `.env` e removido espaço residual na configuração do banco;
- `Specs/SPEC-1ANO-001 - Autenticação e perfis.md`: estado, versão, decisões e checklist atualizados após a implementação;
- este `Project Context.md`: registro integral da execução.

## Verificações executadas

### Backend

Comando final equivalente a `mvn clean test`, usando Java 21 e o repositório Maven local:

```text
Tests run: 14, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

O aviso do Mockito sobre carregamento dinâmico futuro permanece informativo e não afetou os testes.

### Frontend

```text
npm run lint  -> aprovado
npm test      -> 2 testes aprovados, 0 falhas
npm run build -> aprovado com Vite 7.3.7
```

Os testes de API do frontend confirmaram cookies, `no-store`, sequência CSRF/login/renovação e CSRF/logout.

### Navegador e inspeção visual

Como o plugin de navegador não estava disponível no ambiente, foi usado Playwright com Microsoft Edge em modo headless, conforme o fallback de teste. A API foi interceptada apenas nessa verificação visual; a API real foi validada separadamente pelos testes de integração Spring.

Fluxos exercitados:

- desktop 1440×900: login vazio, campos obrigatórios, credenciais inválidas, credenciais válidas, página privada, perfil e logout;
- mobile 375×812 com movimento reduzido: perfil, abertura do menu, foco no primeiro item, fechamento por `Escape` e retorno de foco;
- título da página, ausência de overflow horizontal e ausência de erros inesperados de console.

Capturas finais de QA ficaram fora do repositório em `%TEMP%/oneyear-spec001-qa/`: `login-desktop.png`, `perfil-desktop.png` e `perfil-mobile-menu.png`. Elas foram inspecionadas visualmente contra os conceitos versionados após a última alteração de CSS.

## Matriz dos critérios de sucesso

| Critério | Evidência | Estado |
|---|---|---|
| As duas contas entram e recebem o próprio perfil | Teste de integração autentica as duas contas e compara os perfis. | Atendido |
| Credenciais inválidas não revelam a existência da conta | Teste compara login inexistente com senha errada e exige a mesma resposta 401. | Atendido |
| Sessão expirada retorna ao login | Frontend trata 401 em `/me`; fluxo e estado foram testados. | Atendido |
| Perfil suporta foto e campos vazios | Componente usa avatar/URL privado ou iniciais e fallbacks de descrição/características. | Atendido |
| Logout impede novo acesso privado | Teste reutiliza o cookie invalidado e recebe 401. | Atendido |
| Histórico/cache não restaura dados privados | Estado somente em memória, `no-store` no cliente/servidor e revalidação em `pageshow`. | Atendido |
| Falha de rede no logout limpa a tela e tenta novamente | Limpeza local imediata, aviso e repetição no evento `online`. | Atendido |
| Não há cadastro nem credenciais públicas | Ausência de rota/interface e busca estrutural do bundle. | Atendido |
| Conteúdo e imagens exigem sessão | Regras Spring Security e testes de acesso anônimo. | Atendido |

## Configuração privada e limites externos

- O arquivo local ignorado `oneyear/.env` possui valores preenchidos para login, hash BCrypt e nome das duas contas; os valores não foram lidos para a documentação nem expostos no Git.
- A validação com Neon/PostgreSQL e Object Storage reais não foi executada porque depende de credenciais e serviços externos. O comportamento de autenticação foi validado com H2 em memória e o armazenamento por testes isolados.
- O empacotamento do frontend dentro do JAR não foi adicionado: no desenvolvimento, frontend e backend são iniciados separadamente; a publicação deve servir o build do Vite e a API sob a mesma origem.
- A Galeria permanece apenas indicada e desabilitada nesta interface, pois sua implementação pertence a outras specs.

## Correção posterior do build Maven

- Em 2026-10-06, o parent do `pom.xml` havia sido alterado localmente para Spring Boot 3.4.5, incompatível com os starters modulares usados pelo projeto.
- O parent foi restaurado para Spring Boot 4.1.1, versão definida pela implementação e compatível com `spring-boot-starter-flyway`, `spring-boot-starter-webmvc`, `spring-boot-starter-security-test` e `spring-boot-starter-webmvc-test`.
- Após a correção, `mvn clean test` terminou com `BUILD SUCCESS`: 14 testes executados, sem falhas ou erros.

## Correção posterior do login local

- O login pelo navegador em `http://127.0.0.1:5173` era recusado com HTTP 403 antes da autenticação porque a configuração local de CORS permitia somente `http://localhost:5173`.
- A configuração privada `APP_CORS_ALLOWED_ORIGINS` foi ajustada para aceitar as duas origens locais: `http://localhost:5173` e `http://127.0.0.1:5173`.
- As duas contas já haviam sido confirmadas com sucesso por CSRF, login e consulta autenticada de `/api/v1/me`; o erro era exclusivamente a origem enviada pelo navegador.

# Execução da SPEC-1ANO-002 — História e navegação

## Estado e escopo

- Data da implementação e validação: 2026-10-06.
- Spec executada: `SPEC-1ANO-002 - História e navegação`, atualizada para `implementado`, versão 1.0.
- Regras aplicadas: `Regras para IA.md`.
- Branch usada: `develop`.
- Implementação realizada em `oneyear/frontend`, reaproveitando a autenticação e o contrato privado de história existentes no backend.
- O escopo entregue compreende página inicial com história, navegação entre Inicial/Galeria/Perfil, logout, estados da consulta, temas, controle de movimento, acessibilidade do menu e responsividade.
- Upload, galeria cronológica, mapa interativo, pins e popup não foram antecipados: pertencem às Specs 003 e 004. A Galeria e a área mapa/lista receberam superfícies preparatórias para que a navegação desta spec seja funcional.
- Nenhum fato pessoal foi criado. Quando o autor ainda não configurou frase, introdução, seções ou fotos, a página apresenta um estado vazio neutro.

## Implementação funcional

- `HistoriaPage.jsx` consulta `GET /api/v1/historia` somente após autenticação, usando cookies e `cache: no-store` pelo cliente da API.
- Frase principal, introdução, seções e dicas vêm da resposta privada. As seções são exibidas na ordem devolvida pelo backend; data e foto permanecem opcionais.
- Foram implementados skeleton de carregamento, estado vazio, erro com nova tentativa, preservação de conteúdo já carregado em falha de atualização e fallback “Imagem indisponível” quando apenas uma foto falha.
- A página contém hero editorial, timeline vertical, bloco de orientações e preparação mapa/lista. A arte abstrata existente é usada como representação não pessoal até a Spec 004 fornecer memórias reais.
- `Sidebar.jsx` oferece Inicial, Galeria, Perfil e Sair. Em telas menores, torna-se drawer com `aria-expanded`, foco no primeiro item, fechamento por backdrop ou `Escape` e devolução do foco ao botão acionador.
- `GalleryPage.jsx` fornece uma rota autenticada e um estado preparatório acessível. O texto deixa explícito que o cadastro e a organização cronológica serão adicionados na spec própria.
- `App.jsx` controla as rotas por hash, revalida a sessão antes de trocar de área protegida, retorna ao login em 401 e mantém os dados privados somente em memória.
- `api.js` recebeu a operação `obterHistoria`, sem incluir conteúdo privado no bundle.

## Tema, movimento e acessibilidade

- `preferences.js` concentra tema claro/escuro e pausa de movimento, lê preferências do sistema e usa acesso protegido ao `localStorage`.
- A troca de tema continua funcionando durante a sessão mesmo quando o armazenamento local lança erro; a persistência é restaurada quando disponível.
- O atributo `data-theme` aplica tokens semânticos a login, história, galeria, perfil, navegação, estados e controles existentes.
- O controle de movimento permite pausar e retomar animações. Com `prefers-reduced-motion: reduce`, a pausa é automática, o controle informa o estado e nenhum conteúdo depende de animação para aparecer.
- Estados de foco visível, regiões nomeadas, textos alternativos/fallbacks e controles nativos foram preservados. Não há animação decorativa contínua nem parallax obrigatório.

## Direção visual e referências

Foram gerados com ImageGen e versionados dois conceitos antes da implementação:

- `oneyear/frontend/design-references/spec002-historia-desktop.png`;
- `oneyear/frontend/design-references/spec002-historia-mobile.png`.

Os conceitos preservam a linguagem estabelecida na Spec 001: marca `ana.`, azul-marinho, branco, azul de ação, vermelho afetivo, Geist, grandes títulos editoriais, linhas finas e composição assimétrica. Imagens geradas foram usadas somente como referência e arte; navegação, textos, botões, timeline, controles, estados e conteúdo continuam em HTML/CSS acessível.

### Registro de fidelidade visual

| Ponto comparado | Resultado na renderização final |
|---|---|
| Estrutura desktop | Sidebar fixa, hero amplo, timeline, faixa azul-marinho e área mapa/lista seguem a mesma sequência e proporção geral do conceito. |
| Estrutura móvel | Cabeçalho compacto, hero escuro, timeline em coluna única e drawer sobreposto correspondem à direção aprovada. |
| Hierarquia | Marca, frase principal, títulos de seção, datas e textos auxiliares mantêm a hierarquia editorial de alto contraste. |
| Paleta e temas | Azul-marinho, branco, azul vivo e vermelho foram preservados; a mesma composição recebeu equivalentes coerentes no tema escuro. |
| Timeline | Linha central/vertical, marcadores e alternância assimétrica no desktop se reorganizam sem sobreposição no celular. |
| Navegação | Estado ativo, agrupamento dos itens e ação Sair correspondem ao conceito; os controles de preferência são botões reais acessíveis. |
| Responsividade | As sete larguras exigidas mantiveram leitura, alcance dos controles e ausência de overflow horizontal. |
| Conteúdo dinâmico | Textos e fotos do conceito eram genéricos; a versão final usa exclusivamente a API ou fallbacks neutros, evitando inventar dados pessoais. |

A renderização final foi inspecionada novamente, lado a lado com os dois conceitos, após o último ajuste de tamanho e espaçamento do hero. Não permaneceu diferença material corrigível. A ordem móvel prioriza título/texto antes da foto por leitura semântica, e mapa/pins reais permanecem ausentes intencionalmente até a Spec 004.

## Arquivos adicionados e alterados

Adicionados ao frontend:

- `src/preferences.js`;
- `src/components/VisualControls.jsx`;
- `src/components/HistoriaPage.jsx`;
- `src/components/GalleryPage.jsx`;
- `design-references/spec002-historia-desktop.png`;
- `design-references/spec002-historia-mobile.png`;
- `test/preferences.test.js`.

Alterados:

- `src/App.jsx`: rotas privadas, preferências visuais, revalidação de sessão e composição das páginas;
- `src/api.js`: consulta autenticada da história;
- `src/components/LoginPage.jsx`: controle de tema na tela pública;
- `src/components/Sidebar.jsx`: navegação completa, drawer móvel e controles visuais;
- `src/styles.css`: tokens de tema, timeline, estados, página da galeria, responsividade e movimento reduzido;
- `README.md`: funcionalidades atuais, fronteiras das próximas specs e tratamento privado da história;
- `test/api.test.js`: contrato da consulta privada de história;
- `ApiIntegrationTest.java`: conteúdo de teste, ordenação das seções, introdução e dicas;
- `SPEC-1ANO-002 - História e navegação.md` e requisitos vinculados: estado, evidências e fronteiras atualizados;
- este `Project Context.md`: registro integral da execução.

O antigo `HomePage.jsx`, que era apenas uma confirmação temporária da Spec 001, foi removido e substituído pela página real de história.

## Verificações automatizadas

### Frontend

```text
npm run lint  -> aprovado
npm test      -> 6 testes aprovados, 0 falhas
npm run build -> aprovado com Vite 7.3.7
```

Os testes cobrem cookies e `no-store` na consulta de história, preferências salvas, preferência do sistema, movimento reduzido e indisponibilidade de armazenamento local.

### Backend

```text
mvn clean test
Tests run: 14, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

Além das verificações anteriores de autenticação, o teste de integração confirma frase, introdução, dicas e ordenação das seções privadas. O aviso informativo do Mockito sobre carregamento dinâmico futuro permanece sem impacto no resultado.

## QA renderizado e responsividade

O plugin de navegador não estava disponível neste ambiente. Foi usado Playwright temporário com Microsoft Edge headless como fallback; ele não foi adicionado às dependências do projeto. A API foi interceptada somente para a verificação visual, enquanto o contrato real permaneceu coberto pelos testes Spring.

Foram exercitados exatamente os viewports exigidos: 375×812, 430×932, 768×1024, 1024×800, 1366×900, 1440×900 e 1920×1080. Em todos foram verificados identidade da página, carregamento da história, ausência de overflow horizontal e inexistência de erros inesperados de console.

O roteiro também confirmou:

- seções com e sem foto, fallback de imagem quebrada e texto longo sem quebra natural;
- tema claro para escuro, persistência após recarga e fallback de armazenamento por teste unitário;
- pausa de movimento e conteúdo visível com `prefers-reduced-motion`;
- foco inicial, fechamento por `Escape` e retorno do foco no drawer móvel;
- navegação e estado ativo em Galeria/Perfil;
- sessão expirada com retorno ao login;
- história vazia e orientações preservadas.

Capturas de QA ficaram fora do repositório em `%TEMP%/oneyear-spec002-qa/`: `historia-desktop-1440.png`, `historia-mobile-375.png` e `menu-mobile-375.png`. As capturas finais e os conceitos versionados foram inspecionados visualmente após o último ajuste de CSS.

## Matriz dos critérios da Spec 002

| Critério | Evidência | Estado |
|---|---|---|
| Frase, introdução e história ordenada | Contrato Spring e página renderizada com resposta autenticada. | Atendido |
| História permanece útil sem fotos | Estado sem foto e estado totalmente vazio verificados. | Atendido |
| Falha isolada de foto não remove texto | Fallback renderizado e ausência de overflow confirmados. | Atendido |
| Sidebar/drawer abre Inicial, Galeria e Perfil | Navegação, item ativo e sessão expirada exercitados. | Atendido |
| Foco previsível no menu móvel | Primeiro item, `Escape` e retorno ao acionador confirmados em 375 px. | Atendido |
| Tema claro/escuro e persistência | Alternância, recarga e indisponibilidade de armazenamento cobertas. | Atendido |
| Movimento reduzido e pausa | Preferência do sistema e controle manual cobertos sem ocultar texto. | Atendido |
| Sete larguras sem overflow horizontal | QA renderizado nos sete viewports especificados. | Atendido |
| Upload, popup e mapa/pins reais | Pertencem às Specs 003/004 e não foram declarados como concluídos. | Fora do escopo desta execução |

## Pendências externas e continuidade

- O autor ainda precisa fornecer frase, introdução, seções, datas e fotos reais no arquivo privado/configuração de ambiente. A ausência desses dados não impede a aplicação de iniciar nem a página de exibir o estado vazio.
- A validação visual usou conteúdo neutro interceptado; nenhum dado da conta real, do Neon ou do armazenamento foi lido ou copiado para imagens, testes ou documentação.
- A integração ao Neon e ao Object Storage reais continua dependente das credenciais e dados externos já registrados anteriormente.
- `RNF-1ANO-002` e `RNF-1ANO-003` foram marcados como parcialmente implementados porque seus critérios também abrangem formulário de upload, seleção de foto e popup, componentes que serão entregues pelas Specs 003/004.
