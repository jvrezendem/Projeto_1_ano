---
tipo: projeto
area: 1Ano
status: especificacao
versao: 0.1
data: 2026-10-01
responsavel: Autor do projeto
tags:
  - projeto/1ano
---

# Projeto 1Ano

Site privado como presente de um ano de namoro: história do casal, fotos, mapa de memórias e perfis das duas pessoas.

Este conjunto contém **20 requisitos**, elaborados com [[Template - Requisito Simples]], **cinco specs** e um documento editável de regras para a IA. Todos os requisitos estão como **propostos** e as specs como **rascunho**: não há aprovação ou implementação presumida.

## Comece por aqui

1. Leia as decisões confirmadas e as propostas abaixo.
2. Consulte os requisitos e a spec da funcionalidade que será implementada.
3. Use [[SPEC-1ANO-005 - Backend Spring Boot e contratos REST]] para estrutura MVC e contratos da API.
4. Preencha [[Regras para IA]] com suas instruções.
5. Resolva as decisões pendentes na etapa em que forem necessárias e atualize os documentos.

## Decisões confirmadas pelo pedido

- Backend Java com Spring Boot e API REST.
- Estrutura MVC igual à do Text To SQL.
- Duas contas predefinidas, com login e sem cadastro de usuários.
- Página inicial com história e rolagem vertical animada.
- Cadastro de imagens e extração de localização/data dos metadados disponíveis.
- Mapa com pins de coração; seleção abre foto, lugar e data.
- Sidebar com acesso ao perfil e à galeria.
- Reaproveitamento do frontend já prototipado.

Dos pedidos anteriores recuperados: temas claro/escuro, responsividade, perfil com foto/nome/descrição/características e galeria cronológica. A interface atual indica “mais antigas primeiro” e possui filtro por ano; esses comportamentos foram preservados na especificação.

## Propostas desta documentação

Não são escolhas já confirmadas pelo autor:

| Proposta | Motivo | Documento |
|---|---|---|
| Sessão por cookie; 30 minutos de inatividade | Autenticação simples para duas contas | [[SPEC-1ANO-001 - Autenticação e perfis]] |
| Coleção compartilhada; ambas as contas podem cadastrar e corrigir fotos | Uso conjunto do site | [[SPEC-1ANO-003 - Cadastro de fotos e metadados]] |
| Complementação manual de local e data | Fotos podem não ter metadados utilizáveis | [[SPEC-1ANO-003 - Cadastro de fotos e metadados]] |
| PostgreSQL e arquivos em armazenamento privado separado | Separar dados relacionais de imagens | [[SPEC-1ANO-005 - Backend Spring Boot e contratos REST]] |
| JPEG/PNG, até 15 MiB e 40 MP | Limites iniciais verificáveis para upload | [[SPEC-1ANO-003 - Cadastro de fotos e metadados]] |
| Perfil somente para consulta no MVP | Pedido não define edição de perfil | [[SPEC-1ANO-001 - Autenticação e perfis]] |
| Pacote base com.ano.project e Java 21 como candidato | Adaptar o projeto de referência | [[SPEC-1ANO-005 - Backend Spring Boot e contratos REST]] |

Hospedagem, provedor de mapa e provedor de armazenamento permanecem sem escolha. Não foi assumida uma data de aniversário com base em exemplos das conversas.

## Specs

| ID | Assunto |
|---|---|
| SPEC-1ANO-001 | [[SPEC-1ANO-001 - Autenticação e perfis]] |
| SPEC-1ANO-002 | [[SPEC-1ANO-002 - História e navegação]] |
| SPEC-1ANO-003 | [[SPEC-1ANO-003 - Cadastro de fotos e metadados]] |
| SPEC-1ANO-004 | [[SPEC-1ANO-004 - Mapa e galeria]] |
| SPEC-1ANO-005 | [[SPEC-1ANO-005 - Backend Spring Boot e contratos REST]] |

As quatro primeiras seguem a organização de [[Template - Spec de Feature]], com histórias, cenários, requisitos, critérios de sucesso e questões abertas. A spec técnica usa [[Template - Spec de Software]], ajustado ao porte do projeto.

## Requisitos funcionais

- [[RF-1ANO-001 - Autenticar os dois usuários]]
- [[RF-1ANO-002 - Encerrar a sessão]]
- [[RF-1ANO-003 - Exibir a história do casal]]
- [[RF-1ANO-004 - Navegar pela barra lateral]]
- [[RF-1ANO-005 - Consultar o próprio perfil]]
- [[RF-1ANO-006 - Cadastrar uma imagem]]
- [[RF-1ANO-007 - Extrair metadados da imagem]]
- [[RF-1ANO-008 - Complementar os dados da foto]]
- [[RF-1ANO-009 - Exibir fotos localizadas no mapa]]
- [[RF-1ANO-010 - Abrir a memória pelo pin]]
- [[RF-1ANO-011 - Consultar a galeria cronológica]]
- [[RF-1ANO-012 - Alternar os temas claro e escuro]]

## Regras de negócio

- [[RN-1ANO-001 - Restringir as contas ao casal]]
- [[RN-1ANO-002 - Compartilhar a coleção entre o casal]]

## Requisitos de qualidade

- [[RNF-1ANO-001 - Proteger o conteúdo privado]]
- [[RNF-1ANO-002 - Adaptar a interface às telas]]
- [[RNF-1ANO-003 - Tornar animações e controles acessíveis]]
- [[RNF-1ANO-004 - Manter consistência no cadastro das fotos]]

## Interfaces e arquitetura

- [[RI-1ANO-001 - Disponibilizar a API REST]]
- [[RI-1ANO-002 - Manter a estrutura MVC de referência]]

## Limites do MVP

Inclui autenticação, leitura de perfil, história, upload, revisão de metadados, galeria e mapa. Não inclui cadastro de contas, login social, recuperação por e-mail, editor da história, edição de perfil, exclusão de fotos, vídeos, música, jogos, reconhecimento facial ou compartilhamento público. Esses recursos exigem novos requisitos se forem desejados.

As fotos sem GPS continuam na galeria. Fotos sem data exibem “Data não informada”. O nome de um lugar não deve ser considerado garantido pelo EXIF; preenchimento manual é o caminho inicial proposto.

## Fontes e limites

| Fonte | O que foi aproveitado | Limitação |
|---|---|---|
| Pedido atual de 2026-10-01 | Escopo, Spring Boot/Java, MVC, sidebar, login, fotos e mapa | Não define banco, storage, formato de sessão ou data de entrega |
| Chat “Ideias de projetos românticos”, ID 6abc46a9-53d0-83e9-aeca-3043813f8242 | Pedido original do mapa e das duas contas | Ideias apenas sugeridas pelo assistente não viraram requisitos automaticamente |
| Chat “Criar design do site Ana no Figma”, ID 01a0efd2-c0fa-7710-9e93-31556e0cc51a | Briefings do frontend e relato final da prévia | Relato de testes anteriores não prova integração futura com backend |
| Chat “Armazenar imagens no Spring”, ID 6ab6deb8-a2e0-83e9-a3d0-dad54f56487f | Contexto de Java/Spring/PostgreSQL | Conversa genérica; armazenamento separado era recomendação, não escolha confirmada para 1Ano |
| [Repositório Text To SQL](https://github.com/jvrezendem/Projeto_Text_To_SQL) | Estrutura Maven remota e pom | Árvore remota difere da cópia local; estados registrados na spec técnica |
| Cópia local do Text To SQL | Diretórios MVC existentes | Alguns diretórios estão vazios; não são evidência de camadas já implementadas |
| Frontend em C:/Users/jreze/OneDrive/Documents/ChatGPT/Projeto Aluguel | package.json e App.jsx inspecionados; React/Vite, dados locais e galeria | Nome da pasta é distinto do nome do projeto; não foi alterada nesta tarefa |
| Templates do vault em 99_Templates | Formato das notas | Instruções de preenchimento foram substituídas por conteúdo do projeto |

Cópia local de referência: `C:/UFLA/2026-2/Eng Software/Prospeccao Tecnologica/Projeto_Text_To_SQL`.

Protótipo visual mencionado no chat anterior: [Site Ana no Figma](https://www.figma.com/design/lfhrxTrKujAjq0NJhMAEQk/Site-Ana?node-id=0-1). O arquivo Figma não foi reinspecionado nesta tarefa; a recuperação se baseou no chat e nos arquivos locais selecionados.

Quando houver diferença entre material anterior e pedido atual, este conjunto adota o pedido atual: **sidebar**, preservando a finalidade das opções da antiga topbar.

## Estado de verificação

- Documentação e vínculos internos: revisados nesta entrega.
- Backend, API e testes de aplicação: ainda não implementados por esta tarefa.
- Checkboxes de aceite nas notas: intencionalmente pendentes.
- Checkboxes de revisão textual: indicam somente conferência da redação.
- Regras pessoais para a IA: aguardam seu preenchimento em [[Regras para IA]].

## Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 2026-10-01 | Criação dos requisitos, specs e espaço de regras |

