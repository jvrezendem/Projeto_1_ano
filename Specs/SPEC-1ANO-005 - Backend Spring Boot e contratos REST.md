---
tipo: spec
area: 1Ano
status: rascunho
spec_id: SPEC-1ANO-005
versao: 0.1
data: 2026-10-01
responsavel: Autor do projeto
revisores: []
tags:
  - tipo/spec
  - projeto/1ano
requisitos_relacionados:
  - RI-1ANO-001
  - RI-1ANO-002
  - RNF-1ANO-001
  - RNF-1ANO-004
  - RN-1ANO-001
---

# SPEC-1ANO-005 - Backend Spring Boot e contratos REST

## 0. Controle da spec

| Campo | Valor |
|---|---|
| Objeto | Backend e contrato de integração do MVP |
| Estado | Rascunho; sem implementação |
| Versão | 0.1 |
| Responsável e decisor | Autor do projeto |
| Entrega | Antes da publicação do presente; data ainda não informada |
| Base | [[00 - Projeto 1Ano#Fontes e limites]] |

**Decisão sustentada:** organizar o backend no padrão solicitado e definir contratos para integrar o frontend existente.
**Pendências centrais:** mecanismo de sessão, banco/armazenamento e provedor de mapa.

## 1. Resumo executivo

O backend expõe uma API REST em Java com Spring Boot para duas contas predefinidas. Ele autentica o casal, entrega conteúdo privado, cadastra fotos, extrai metadados e fornece dados ao mapa e à galeria. A organização deve reproduzir a estrutura MVC do Text To SQL, com classes próprias do domínio de memórias. Contratos, banco, armazenamento e limites abaixo são propostas para implementação, salvo as restrições explicitamente solicitadas.

## 2. Contexto e evidências

O repositório de referência é [Projeto_Text_To_SQL](https://github.com/jvrezendem/Projeto_Text_To_SQL). A consulta à árvore remota de `main` retornou o commit `d415f742d5ba41175114df4acfc99cbb27ae9281`, com um esqueleto Maven em `project/`.

A cópia local encontrada em `C:/UFLA/2026-2/Eng Software/Prospeccao Tecnologica/Projeto_Text_To_SQL`, com HEAD `6e18c34d65a7c1bea6f2882527cbc0a4f691f525`, contém também os diretórios MVC. Vários estão vazios e por isso sua existência local não deve ser confundida com conteúdo rastreado na árvore remota consultada.

A árvore abaixo reproduz os diretórios locais observados. Os nomes das classes são adaptados ao domínio de memórias e o pacote base proposto é `com.ano.project`.

## 3. Objetivos e sucesso

| Objetivo | Evidência esperada |
|---|---|
| Integrar o frontend à API real | Login → upload → galeria → pin → popup funciona após recarregar |
| Reproduzir a organização solicitada | Inspeção da árvore MVC |
| Preservar privacidade | Requisições anônimas não retornam conteúdo pessoal |
| Manter fotos consistentes | Falhas do banco/storage não publicam registros incompletos |

## 4. Escopo e fronteiras

- Um backend Spring Boot, uma aplicação frontend React e uma coleção compartilhada.
- Sem cadastro público, microsserviços, filas obrigatórias ou painel administrativo.
- Proposta: PostgreSQL para dados e armazenamento privado para arquivos.
- Frontend faz o papel de apresentação; controllers REST devolvem DTOs, sem templates de página no backend.

## 5. Atores e permissões

As duas contas autenticadas leem a história, consultam o próprio perfil, leem a coleção e cadastram/corrigem fotos. Não há acesso anônimo ao conteúdo privado. A identidade do autor do upload vem da sessão, nunca de um campo controlado pelo cliente.

## 6. Glossário

- **Foto/memória:** registro de uma imagem com local e data opcionais.
- **Pin:** representação geográfica de uma foto; não é uma entidade independente.
- **Data de captura:** data do momento da foto; pode ser desconhecida.
- **Data de envio:** instante em que o servidor recebeu o cadastro.

## 7. Restrições e propostas

| Item | Situação |
|---|---|
| Java + Spring Boot + API REST | Confirmado pelo pedido |
| Mesmos diretórios MVC da referência | Confirmado pelo pedido |
| Duas contas, sem cadastro | Confirmado pelo pedido |
| Sessão por cookie e instância única | Proposta |
| PostgreSQL + arquivos em armazenamento privado separado | Proposta; conversa anterior relacionada mencionou PostgreSQL |
| Java 21 | Candidato coerente com o pom inspecionado; validar ambiente |
| Versão do Spring Boot e dependências | Definir e validar na implementação; não copiar versões sem verificar compatibilidade |
| Pacote base com.ano.project | Provisório |

## 8. Estado atual

Há frontend demonstrativo e documentação inicial. O relatório final do chat anterior informa ausência de formulários, autenticação, upload e API. A inspeção atual de `App.jsx` confirma uso de memórias locais e topbar. Esta tarefa produz documentação; não migra nem altera aquele frontend.

## 9. Comportamento proposto

`Frontend → Spring Security → controller → service → database/repository → banco`

No cadastro, o service também coordena extração de metadados e armazenamento. O frontend recebe somente os campos necessários à interface.

## 10. Cenário principal de integração

Dadas as duas contas provisionadas, a primeira entra e cadastra uma foto com GPS e data. A foto aparece na galeria e no mapa. A segunda conta entra e abre o mesmo pin, vendo a mesma imagem, lugar e data. Após logout, chamadas diretas à foto são recusadas.

Esse cenário será o teste de aceite integrado; ainda não foi executado.

## 11. Regras de negócio

- Exatamente duas contas de acesso, provisionadas fora do fluxo público.
- Coleção comum e permissões iguais, como proposta registrada.
- Sem coordenadas válidas não há pin.
- Sem data de captura não há data inventada.
- Arquivos permanecem privados.

## 12. Requisitos relacionados

- [[RN-1ANO-001 - Restringir as contas ao casal]]
- [[RNF-1ANO-001 - Proteger o conteúdo privado]]
- [[RNF-1ANO-004 - Manter consistência no cadastro das fotos]]
- [[RI-1ANO-001 - Disponibilizar a API REST]]
- [[RI-1ANO-002 - Manter a estrutura MVC de referência]]

As quatro specs de funcionalidade detalham as regras de autenticação, experiência, imagens, mapa e galeria. Este documento centraliza os contratos e a organização técnica.

## 13. Dados e estados

### Modelo proposto

| Dado | Campos principais | Persistência |
|---|---|---|
| Usuario | id, login único, senhaHash, nome, avatarKey opcional, descrição, características | Banco; somente duas contas provisionadas |
| Foto | id, autorId, storageKey, contentType, tamanho, largura, altura, legenda, lugar, latitude, longitude, dataCaptura, horaCaptura, offsetCaptura, origemLocalizacao, origemData, criadoEm, atualizadoEm | Banco; arquivo fora do banco |
| História | frase, introdução, seções ordenadas, dicas | Recurso privado/configuração do backend inicialmente |
| Sessão | usuário autenticado e expiração | Servidor; memória na proposta inicial |

`autorId` é uma referência a Usuario. IDs propostos: UUID, gerados no servidor. `dataCaptura` usa semântica de data civil; `criadoEm` e `atualizadoEm` usam instantes UTC. Hora e offset só são preenchidos quando disponíveis.

Constraints: login único; storageKey única; latitude/longitude simultaneamente nulas ou válidas; limite de duas contas conferido no provisionamento e na inicialização, sem endpoint de criação.

A foto torna-se consultável apenas após confirmar arquivo e registro. A compensação e a limpeza de órfãos estão em [[SPEC-1ANO-003 - Cadastro de fotos e metadados]].

## 14. API REST proposta

Prefixo: `/api/v1`. JSON em UTF-8, salvo arquivos e multipart.

| Método e caminho | Entrada | Sucesso | Acesso |
|---|---|---|---|
| GET /auth/csrf | Nenhuma | 200 CsrfResponse | Público; não retorna conteúdo pessoal |
| POST /auth/login | LoginRequest + CSRF | 200 PerfilResponse + cookie de sessão | Público com CSRF |
| POST /auth/logout | CSRF, sem corpo | 204; invalida sessão e cookie | Sessão, ou 204 se já expirada e CSRF válido |
| GET /me | Sessão | 200 PerfilResponse | Autenticado |
| GET /me/avatar | Sessão | 200 imagem; 404 se ausente | Autenticado |
| GET /historia | Sessão | 200 HistoriaResponse | Autenticado |
| POST /fotos | multipart com parte file | 201 FotoResponse + Location | Autenticado + CSRF |
| GET /fotos | page, size, ano opcional | 200 PaginaFotoResponse | Autenticado |
| GET /fotos/anos | Nenhuma | 200 lista de anos disponíveis | Autenticado |
| GET /fotos/pins | page e size | 200 PaginaPinResponse | Autenticado |
| GET /fotos/{id} | ID | 200 FotoResponse | Autenticado |
| GET /fotos/{id}/arquivo | ID | 200 binário com tipo validado | Autenticado |
| PATCH /fotos/{id} | FotoPatchRequest | 200 FotoResponse | Autenticado + CSRF |

Não há `POST /usuarios`, `/register` nem DELETE de fotos no MVP. Rotas estáticas como `/anos` e `/pins` não devem ser tratadas como UUID.

### DTOs

- **CsrfResponse:** `token` e `headerName`; frontend usa o nome retornado.
- **LoginRequest:** `login`, `senha`.
- **PerfilResponse:** `id`, `nome`, `avatarUrl` opcional, `descricao`, `caracteristicas`; sem hash ou senha.
- **FotoResponse:** `id`, `arquivoUrl` relativa e autenticada, `contentType`, `largura`, `altura`, `legenda`, `lugar`, `latitude`, `longitude`, `dataCaptura`, `horaCaptura`, `offsetCaptura`, `origemLocalizacao`, `origemData`, `criadoEm`, `atualizadoEm` e `avisos`.
- **FotoPatchRequest:** somente `legenda`, `lugar`, `latitude`, `longitude`, `dataCaptura`. Campo ausente mantém o valor; null limpa um valor opcional. Latitude/longitude devem ser enviadas juntas. Alterar data manualmente limpa hora e offset anteriores para não associá-los a uma nova data.
- **PinResponse:** `fotoId`, `latitude`, `longitude`, `lugar`, `dataCaptura`.
- **PaginaFotoResponse/PaginaPinResponse:** `items`, `page`, `size`, `totalElements`, `totalPages`, `hasNext`.
- **HistoriaResponse:** `frasePrincipal`, `introducao`, `secoes` com `id`, `ordem`, `titulo`, `texto`, `data` e `fotoId` opcionais, além de `dicas`.

Datas civis: `YYYY-MM-DD`; instantes: ISO 8601 com UTC. Campos opcionais conhecidos como ausentes usam null. Nenhum DTO expõe storageKey ou caminho de disco.

### Paginação, atualização e repetição

- `page` começa em 0; size padrão 24 na galeria e 100 nos pins; máximo 100.
- Valores fora dos limites: 400; página além do final: 200 com items vazio.
- Galeria: dataCaptura crescente, nulos ao final, criadoEm e id como desempate.
- Pins: ordenação estável por id; o frontend percorre hasNext, separadamente da galeria.
- `ano`: inteiro de quatro dígitos; filtra data de captura. Fotos sem data ficam fora do filtro anual.
- GET /fotos/anos devolve anos distintos de toda a coleção, em ordem crescente.
- Alterações bem-sucedidas invalidam galeria, anos, detalhe e pins no frontend.
- PATCH aplica os campos aceitos em uma única transação. Proposta inicial para concorrência: última gravação confirmada prevalece nos campos enviados.
- POST de upload não tem deduplicação nem repetição automática. Em resultado incerto de rede, consultar a galeria antes de novo envio.

### Erros

Formato único proposto:

```json
{
  "codigo": "COORDENADAS_INVALIDAS",
  "mensagem": "Informe latitude e longitude válidas.",
  "campos": {
    "latitude": "Deve estar entre -90 e 90."
  },
  "traceId": "identificador-da-requisicao"
}
```

| Status | Condição |
|---|---|
| 400 | JSON inválido, campo inválido, UUID malformado ou paginação fora dos limites |
| 401 | Sem sessão válida ou credenciais incorretas |
| 403 | CSRF ausente/inválido ou operação proibida |
| 404 | Recurso inexistente após autenticação |
| 413 | Arquivo excede tamanho permitido |
| 415 | Tipo real de arquivo não suportado |
| 422 | Imagem corrompida ou limite de pixels excedido |
| 503 | Dependência necessária indisponível |
| 500 | Falha inesperada, sem detalhes internos |

Requisições anônimas de leitura retornam 401. Escritas com CSRF inválido podem ser recusadas com 403 antes da autenticação; o frontend consulta /me para distinguir sessão expirada de falha de token. Erros da cadeia de segurança precisam usar o mesmo contrato dos erros de controller.

## 15. Experiência de integração

Manter os componentes do protótipo e substituir dados locais por chamadas autenticadas. Durante desenvolvimento, mocks podem existir em modo explicitamente identificado. Produção não deve apresentar mock quando a API falhar. Conteúdo privado não fica embutido no JavaScript público, inclusive história e biografias.

## 16. Segurança e privacidade propostas

- Sessão por cookie e CSRF conforme [[SPEC-1ANO-001 - Autenticação e perfis]].
- Senhas em hash; segredos em configuração externa, nunca no Git, vault ou frontend.
- Arquivos entregues pelo backend após autenticação; armazenamento sem leitura pública.
- Respostas privadas com `Cache-Control: no-store`; limpar dados em memória ao sair.
- CORS, quando necessário em desenvolvimento, restrito às origens definidas; não usar origem irrestrita com cookies.
- Logs com traceId, operação e status; sem senhas, tokens, bytes da foto ou GPS detalhado.
- Originais podem conter outros metadados: não expor EXIF completo na API.
- Definir limitação de tentativas de login na implementação; devolver 429 caso o limite configurado seja atingido.
- Não ativar documentação interativa pública com dados privados de exemplo.

## 17. Arquitetura e estrutura de pastas

A árvore de **diretórios Java** deve permanecer igual à cópia local de referência, com pacote base ajustado. As classes abaixo são propostas do domínio, não arquivos já existentes:

```text
project/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/com/ano/project/
│   │   │   ├── ProjectApplication.java
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   └── UsuariosIniciaisConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── PerfilController.java
│   │   │   │   ├── HistoriaController.java
│   │   │   │   └── FotoController.java
│   │   │   ├── database/
│   │   │   │   ├── models/
│   │   │   │   │   ├── Usuario.java
│   │   │   │   │   └── Foto.java
│   │   │   │   └── repository/
│   │   │   │       ├── UsuarioRepository.java
│   │   │   │       └── FotoRepository.java
│   │   │   ├── exception/
│   │   │   ├── handler/
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   └── service/
│   │   │       ├── UsuarioService.java
│   │   │       ├── HistoriaService.java
│   │   │       ├── FotoService.java
│   │   │       ├── MetadadosService.java
│   │   │       └── ArmazenamentoService.java
│   │   └── resources/
│   │       └── application.yaml
│   └── test/java/com/ano/project/
└── .mvn/wrapper/
```

| Camada | Responsabilidade | Limite |
|---|---|---|
| config | Segurança, configuração e provisionamento das duas contas | Sem credenciais fixas no código |
| controller | HTTP, validação de DTO e status | Não acessa banco ou storage diretamente |
| service | Regras, transações, metadados e coordenação de arquivo | Não depende de detalhes da interface visual |
| database/models | Entidades persistidas | Não são serializadas diretamente na API |
| database/repository | Acesso a dados | Não decide regra de upload nem autorização |
| exception | Exceções de domínio | Não contém textos sensíveis do ambiente |
| handler | Traduz erros em respostas HTTP | Não expõe stack traces |

DTOs podem ser records em arquivos no pacote `controller`, próximos dos contratos, preservando a árvore de pastas. Não adicionar automaticamente `dto/`, `security/` ou `storage/` se a estrutura deve ser idêntica. Se uma nova pasta se mostrar necessária, registrar a alteração e sua razão antes de aplicá-la.

Dependências candidatas: Spring Web MVC, Spring Security, validação, Spring Data JPA, driver do banco escolhido, biblioteca de extração de metadados e adaptador de armazenamento. Escolher versões compatíveis e biblioteca EXIF após validar JPEG/PNG reais. Não reaproveitar entidades de futebol nem regras Text To SQL.

### Alternativas consideradas

| Alternativa | Resultado nesta proposta |
|---|---|
| Cookie de sessão | Preferida pela simplicidade e entrega privada de imagens na mesma origem |
| JWT e refresh tokens | Adiados; requisito não exige essa complexidade |
| Binário no banco | Não escolhido nesta proposta; separar arquivo e metadados |
| Arquivo em pasta efêmera do servidor | Inadequado para produção persistente |
| Armazenamento privado persistente local ou de objetos | Escolha pendente conforme hospedagem |

## 18. Verificação e aceite

| Área | Verificação prevista |
|---|---|
| Auth | Duas contas, senha incorreta, expiração, CSRF e logout |
| Privacidade | Chamadas diretas a história, perfil, foto, arquivo e pins sem sessão |
| Metadados | EXIF completo, ausente, parcial, GPS sul/oeste e datas sem fuso |
| Persistência | Falha do banco/storage, compensação e queda entre etapas |
| Contratos | JSON, status, paginação, filtros e nulls conforme esta spec |
| Estrutura | Diretórios iguais à referência local |
| Ponta a ponta | Entrar, enviar, revisar, listar, abrir pin e sair |

Evidências devem ser associadas aos IDs CT dos requisitos após a execução. Nenhum teste foi executado nesta tarefa de documentação.

## 19. Entrega e operação

Sequência sugerida: estrutura MVC → autenticação → armazenamento/upload → metadados → galeria/mapa → integração visual → conteúdo real e aceite.

Antes de produção: definir hospedagem, persistência, HTTPS, variáveis necessárias, estratégia de backup do banco e dos arquivos e validar uma restauração. Alterações de schema devem ser versionadas; ferramenta e diretório de migrações serão definidos na implementação, preservando a estrutura Java.

Sem data ou domínio definidos. Esta spec não autoriza automaticamente publicação nem contratação de serviços.

## 20. Riscos

| Risco | Tratamento |
|---|---|
| Fotos sem GPS, sem data ou em HEIC | Complementação manual e decisão explícita de formatos |
| Mapa apenas ilustrativo ser confundido com integração pronta | Substituir e verificar posições reais |
| Arquivos em disco efêmero | Escolher armazenamento persistente |
| Diferença entre cópia local e remoto | Registrar os dois estados e a fonte da árvore |
| Mock aparecer como dado real | Modo de demonstração explícito e separado |
| Queda durante upload | Compensação e reconciliação de órfãos |

## 21. Rastreabilidade

| Spec funcional | Componentes principais | Evidência |
|---|---|---|
| [[SPEC-1ANO-001 - Autenticação e perfis]] | SecurityConfig, AuthController, UsuarioService | Aceite de login/perfil/logout |
| [[SPEC-1ANO-002 - História e navegação]] | HistoriaController, frontend | Aceite visual e navegação |
| [[SPEC-1ANO-003 - Cadastro de fotos e metadados]] | FotoController, FotoService, MetadadosService, ArmazenamentoService | Aceite de upload e metadados |
| [[SPEC-1ANO-004 - Mapa e galeria]] | FotoRepository, consultas de pins/galeria, frontend | Aceite de posições, popup e paginação |

## 22. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 2026-10-01 | Especificação inicial a partir do pedido, chats e fontes inspecionadas |

## 23. Decisões pendentes e checklist

- [ ] Confirmar sessão por cookie, banco e armazenamento.
- [ ] Fixar pacote base, JDK e versões compatíveis do Spring Boot.
- [ ] Escolher biblioteca EXIF e verificar os formatos reais.
- [ ] Escolher provedor de mapa.
- [ ] Revisar limites iniciais e permissões da coleção.
- [ ] Definir conteúdo e hospedagem antes da entrega final.
- [x] Requisitos, dados, contratos, estrutura e falhas principais documentados.

Essas pendências não impediram criar a documentação. Devem ser resolvidas no momento indicado em cada spec, sem apresentar propostas como decisões já tomadas pelo autor.

