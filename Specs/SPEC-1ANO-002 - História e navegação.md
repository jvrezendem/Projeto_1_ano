---
tipo: spec-feature
area: 1Ano
status: implementado
spec_id: SPEC-1ANO-002
versao: 1.0
data: 2026-10-01
responsavel: Autor do projeto
tags:
  - tipo/spec
  - projeto/1ano
requisitos_relacionados:
  - RF-1ANO-003
  - RF-1ANO-004
  - RF-1ANO-012
  - RNF-1ANO-002
  - RNF-1ANO-003
---

# SPEC-1ANO-002 - História e navegação

**Estado:** implementado e validado em 2026-10-06.
**Origem:** [[00 - Projeto 1Ano#Fontes e limites]].
**Branch:** `develop`.

## Relação com os requisitos do vault

- [[RF-1ANO-003 - Exibir a história do casal]]
- [[RF-1ANO-004 - Navegar pela barra lateral]]
- [[RF-1ANO-012 - Alternar os temas claro e escuro]]
- [[RNF-1ANO-002 - Adaptar a interface às telas]]
- [[RNF-1ANO-003 - Tornar animações e controles acessíveis]]

## Contexto e decisão

Reutilizar o frontend React existente, preservando o caráter romântico, os temas claro/escuro e a linguagem visual já trabalhada. A página inicial apresenta frase de destaque, história em sequência, orientações de uso e mapa. A navegação será por **sidebar**, conforme o pedido atual, substituindo a topbar como navegação principal.

O frontend implementado usa React, Vite e CSS. Autenticação, perfis e a API privada já são reais; o conteúdo de história continua configurável e permanece vazio até o autor fornecer textos e fotos. Upload, galeria cronológica, mapa interativo e popup pertencem às specs posteriores e não devem ser tratados como concluídos por esta entrega.

### Fronteira de responsabilidade

- **Frontend:** composição visual, animações, navegação e estados de carregamento.
- **Backend:** conteúdo privado e dados das memórias.
- **Autor:** texto final da história, fotos, data comemorativa e dados pessoais; nenhum desses fatos deve ser inventado.

## Histórias e testes

### HU-I01 — Reviver nossa história (P1)

Como integrante do casal, quero percorrer a história por rolagem vertical até chegar às memórias no mapa.

**Teste independente:** renderizar a página com conteúdo de teste autenticado.

1. Ao entrar, a frase principal e a introdução aparecem antes da sequência histórica.
2. Ao rolar, as seções surgem com animações discretas sem bloquear a rolagem.
3. Sem fotos, a história e as orientações continuam disponíveis.

### HU-I02 — Acessar as páginas em qualquer tela (P1)

Como integrante do casal, quero abrir galeria e perfil sem perder o contexto da navegação.

**Teste independente:** navegar nas três áreas nas sete larguras especificadas.

1. A sidebar indica a página ativa; no celular, transforma-se em menu recolhível.
2. O botão do menu informa seu estado e pode ser acionado por teclado.
3. Ao abrir e fechar o menu, o foco permanece previsível e volta ao acionador.

### HU-I03 — Escolher a apresentação (P2)

Como usuário, quero alternar o tema e reduzir o movimento conforme minha preferência.

**Teste independente:** trocar tema e simular `prefers-reduced-motion`.

1. Claro e escuro cobrem login, história, galeria, perfil, upload e popup.
2. Movimento reduzido remove parallax e efeitos decorativos contínuos, sem ocultar conteúdo.
3. O controle de pausa existente no protótipo é preservado.

## Requisitos e composição

Ordem proposta da página inicial:

1. Frase principal e introdução.
2. História ou timeline com textos e fotos selecionados.
3. Dicas breves sobre galeria, cadastro e pins.
4. Mapa interativo com acesso alternativo em lista.

Sidebar: Inicial, Galeria, Perfil e Sair. O cadastro de fotos fica acessível pela galeria; não precisa de uma nova página permanente no menu.

Preservar tokens, fontes e componentes existentes quando adequados. O conteúdo pessoal real virá da API autenticada. A tela pública de login não deve carregar fotos reais nem a história no bundle inicial.

## Estados e acessibilidade

- **Carregando:** reservar o espaço do conteúdo; skeleton onde fizer sentido.
- **Vazio:** explicar a ausência e oferecer cadastro de foto na galeria.
- **Erro:** mensagem útil e nova tentativa sem apagar conteúdo já carregado.
- **Popup/menu:** foco visível, abertura por teclado, fechamento por Esc e retorno do foco.
- **Mapa:** alternativa em lista com as mesmas memórias.
- **Animações:** interrompíveis; nenhum texto depende de uma animação terminar para ficar acessível.

## Entidades principais

- **HistoriaResponse:** frase principal, introdução, lista ordenada de seções e dicas.
- **SecaoHistoria:** ID, ordem, título, texto, data opcional e foto opcional.
- **Preferência visual:** tema e pausa de movimento no dispositivo, sem relação com credenciais.

## Critérios de sucesso

- Fluxos completos em 375, 430, 768, 1024, 1366, 1440 e 1920 px sem rolagem horizontal da página.
- Login, sidebar, galeria, formulário de foto e popup utilizáveis por teclado.
- Todos os textos continuam visíveis com movimento reduzido.
- Conteúdo do protótipo claramente identificado como demonstração até a substituição.

## Suposições

- A história é configurada pelo autor, sem editor administrativo no MVP.
- React/Vite/CSS serão mantidos.
- A forma exata de animação segue o protótipo; não é necessário redesenhar o site para integrar a API.

## Fora do escopo

Novo redesign completo, editor de história, músicas, jogos, contador de namoro, cápsula do tempo e outras ideias não selecionadas no pedido.

## Resultado da implementação

- A página inicial autenticada consome `GET /api/v1/historia` com `cache: no-store` e apresenta frase, introdução, seções ordenadas, fotos opcionais e dicas.
- Foram implementados estados de carregamento, vazio, erro com nova tentativa e falha isolada de imagem sem perda do texto.
- A sidebar abre Inicial, Galeria e Perfil, encerra a sessão e se transforma em drawer móvel com foco inicial, fechamento por `Escape` e retorno do foco.
- Tema claro/escuro e pausa de movimento são preferências locais não sensíveis, com fallback quando `localStorage` está indisponível e respeito a `prefers-reduced-motion`.
- A composição foi validada sem overflow nas larguras 375, 430, 768, 1024, 1366, 1440 e 1920 px.
- Galeria, mapa e lista têm superfícies de preparação e navegação. O cadastro de fotos, a galeria cronológica, os pins reais e o popup permanecem sob responsabilidade das Specs 003 e 004.
- Nenhum texto, data, local ou foto pessoal foi inventado; sem configuração privada, a interface apresenta um estado vazio neutro.

## Questões abertas

| ID | Questão | Responsável | Momento | Bloqueia? |
|---|---|---|---|---|
| Q-I01 | Fornecer história final, fotos e data de aniversário. | Autor | Antes da entrega do presente | Conteúdo final |
| Q-I02 | Confirmar qual cópia do frontend será o repositório de implementação. **Resolvida:** `oneyear/frontend`. | Autor | Resolvida em 2026-10-06 | Não |

## Checklist antes do planejamento

- [x] Diferença entre sidebar solicitada e topbar existente registrada.
- [x] Estados vazios, falhas e movimento reduzido especificados.
- [x] Requisitos de responsividade vinculados.
- [x] Repositório de implementação definido em `oneyear/frontend`.
- [ ] Conteúdo pessoal real fornecido pelo autor; não bloqueia a implementação nem o estado vazio.


