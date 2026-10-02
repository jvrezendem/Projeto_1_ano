---
tipo: spec-feature
area: 1Ano
status: rascunho
spec_id: SPEC-1ANO-004
versao: 0.1
data: 2026-10-01
responsavel: Autor do projeto
tags:
  - tipo/spec
  - projeto/1ano
requisitos_relacionados:
  - RF-1ANO-009
  - RF-1ANO-010
  - RF-1ANO-011
  - RNF-1ANO-001
  - RNF-1ANO-003
---

# SPEC-1ANO-004 - Mapa e galeria

**Estado:** rascunho para revisão; não representa implementação concluída.
**Origem:** [[00 - Projeto 1Ano#Fontes e limites]].
**Branch:** não criada; este documento especifica o comportamento.

## Relação com os requisitos do vault

- [[RF-1ANO-009 - Exibir fotos localizadas no mapa]]
- [[RF-1ANO-010 - Abrir a memória pelo pin]]
- [[RF-1ANO-011 - Consultar a galeria cronológica]]
- [[RNF-1ANO-001 - Proteger o conteúdo privado]]
- [[RNF-1ANO-003 - Tornar animações e controles acessíveis]]

## Contexto e decisão

O mapa é uma visão das fotos localizadas; a galeria é a visão de todas as fotos. Ambos usam os mesmos IDs e dados persistidos. O mapa ilustrativo do protótipo precisará ser substituído por uma implementação geográfica real, capaz de posicionar latitude e longitude.

Preservar a galeria cronológica com **mais antigas primeiro**, conforme a interface atual inspecionada, e o filtro por ano existente. Fotos sem data ficam depois das datadas em um grupo Sem data. O provedor de mapa ainda está em aberto.

### Fronteira de responsabilidade

- **Backend:** fornecer apenas fotos com coordenadas válidas para pins; fornecer galeria paginada e detalhes.
- **Frontend:** posicionar pins, agrupar sobreposições, abrir popup e tratar temas, navegação e falhas.
- **Provedor de mapa:** mapa base; não deve receber arquivos pessoais, credenciais ou legendas.
- **Autor:** escolher provedor compatível com orçamento e hospedagem.

## Histórias e testes

### HU-M01 — Explorar nossos lugares (P1)

Como integrante do casal, quero selecionar corações no mapa para rever uma memória.

**Teste independente:** usar três fotos de teste em coordenadas conhecidas, incluindo duas no mesmo lugar.

1. Os pins são posicionados pelas coordenadas reais.
2. Cada pin abre a memória correspondente com foto, lugar e data.
3. Duas fotos no mesmo ponto permanecem acessíveis por um seletor ou agrupamento.
4. Sem fotos localizadas, o mapa apresenta estado vazio, sem pins inventados.

### HU-M02 — Rever todas as fotos (P1)

Como integrante do casal, quero acessar a galeria, incluindo fotos sem GPS.

**Teste independente:** consultar uma coleção com fotos datadas, sem data e sem GPS.

1. As datadas aparecem em ordem crescente de data de captura.
2. As sem data ficam em grupo próprio ao final.
3. Ao selecionar uma foto, abre o mesmo detalhe usado pelo mapa.
4. O filtro por ano considera a data de captura; “Todos” inclui fotos sem data.

### HU-M03 — Continuar sem mapa (P2)

Como integrante do casal, quero acessar memórias mesmo quando o mapa base não carrega.

**Teste independente:** bloquear a conexão com o provedor de mapa.

1. A página mostra erro localizado na área do mapa.
2. A lista alternativa de memórias e a galeria continuam disponíveis.
3. Um erro do mapa não encerra a sessão.

## Requisitos, dados e estados

### Pin

Campos: `fotoId`, `latitude`, `longitude`, `lugar` e `dataCaptura`. Não incluir imagem em base64 nem a chave interna de armazenamento.

A consulta dos pins é independente da página atual da galeria. Todas as páginas de pins devem ser carregadas, ou consultadas por área visível em futura evolução; nunca mostrar apenas os pins da primeira página da galeria como se fossem a coleção completa.

### Popup e detalhe

- Uma imagem, nome do lugar e data.
- Sem nome: exibir coordenadas formatadas; sem data: “Data não informada”.
- Imagem com falha: placeholder e opção de tentar novamente; demais dados permanecem.
- Abertura por clique, toque ou teclado; Esc e botão visível fecham.
- Em telas pequenas, um painel/modal pode substituir o popup estreito.
- Fotos coincidentes: selecionar qual memória abrir sem descartar as demais.

### Galeria

Ordenação: `dataCaptura ASC NULLS LAST`, depois `criadoEm ASC` e `id ASC`. No grupo sem data, a data de envio serve apenas à ordem interna.

Paginação proposta: 24 fotos por página, máximo de 100. O filtro por ano aplica-se no backend e não apenas às fotos já carregadas. A lista de anos disponíveis considera a coleção completa. Ao trocar o filtro, reiniciar paginação e preservar a escolha na URL, conforme o protótipo.

Mudanças de dados invalidam as consultas relacionadas. Se uma data corrigida mover a foto para outra posição, refazer a lista; não manter ordenações contraditórias.

## Critérios de sucesso

- Três coordenadas de teste correspondem às posições esperadas no mapa.
- Fotos sem coordenadas continuam acessíveis pela galeria e não geram pins.
- Todas as fotos em coordenadas coincidentes podem ser abertas.
- Com mais de 24 fotos e mais de 100 pins de teste, nenhuma página é silenciosamente omitida.
- Popup e detalhe apresentam o mesmo ID, lugar e data.
- Com falha do provedor, a lista alternativa continua utilizável.

## Suposições

- Uma foto representa uma memória e pode gerar um pin; álbuns não são entidades do MVP.
- O agrupamento depende da biblioteca escolhida, preservando o acesso a cada foto.
- A data civil de captura, não a data de envio, orienta o filtro por ano.

## Fora do escopo

Rotas entre lugares, navegação GPS, localização em tempo real, mapas offline, Street View, compartilhamento público e geocodificação obrigatória.

## Questões abertas

| ID | Questão | Responsável | Momento | Bloqueia? |
|---|---|---|---|---|
| Q-M01 | Escolher biblioteca e provedor de mapas, avaliando cota, custo e atribuição. | Autor | Antes do mapa real | Integração do mapa |
| Q-M02 | Definir volume aproximado de fotos para calibrar paginação e miniaturas. | Autor | Antes da avaliação de desempenho | Não bloqueia os contratos iniciais |

## Checklist antes do planejamento

- [x] Relação entre mapa, foto e galeria definida.
- [x] Pins coincidentes, dados ausentes e indisponibilidade cobertos.
- [x] Filtro existente e ordem cronológica preservados.
- [ ] Provedor de mapa escolhido.


