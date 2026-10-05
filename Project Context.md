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
- Não houve publicação, contratação de serviço ou alteração do frontend.
- O provedor de mapa continua sendo uma decisão do frontend; o backend já entrega coordenadas e pins conforme o contrato.
- A execução dos testes mostra um aviso do Mockito sobre carregamento dinâmico de agente em versões futuras do JDK. Ele não causou falha no Java 21 usado e não afeta o código de produção.
