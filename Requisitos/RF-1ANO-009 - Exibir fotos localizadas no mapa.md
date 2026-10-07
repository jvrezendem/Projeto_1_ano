---
tipo: requisito
area: 1Ano
status: implementado
prioridade: Must
versao: 1.0
data: 2026-10-07
responsavel: Autor do projeto
tags:
  - tipo/requisito
  - projeto/1ano
fonte: "Pedido atual"
objetivo_pai: "[[00 - Projeto 1Ano]]"
metodo_verificacao: teste e inspeção
---

# RF-1ANO-009 - Exibir fotos localizadas no mapa

## Resumo

| Campo | Valor |
|---|---|
| ID | RF-1ANO-009 |
| Tipo | Funcional |
| Prioridade | Must |
| Status | Implementado |
| Responsável | Autor do projeto |
| Origem | Pedido atual; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando o mapa for aberto, o frontend deve representar as fotos com coordenadas válidas por pins de coração nas posições geográficas correspondentes.

## Por quê

Associar as memórias aos lugares em que aconteceram.

## Critérios de aceite

- [x] **Sucesso** — Dado fotos com coordenadas, quando abrir o mapa, então cada memória localizada fica acessível por um pin de coração.
- [x] **Fronteira** — Dado duas fotos com a mesma coordenada, quando selecionar o ponto, então ambas ficam acessíveis por seleção ou agrupamento.
- [x] **Falha** — Dado provedor do mapa indisponível, quando abrir a seção, então um aviso e acesso alternativo às fotos são exibidos.

## Regras e limites

- **Entradas/dados**: Latitude e longitude da foto; fotos sem GPS ficam disponíveis na galeria.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-004 - Mapa e galeria]].
- **Fora do escopo**: Pins para fotos sem coordenadas e rastreamento da localização atual.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência**: Leaflet posiciona pins reais, agrupa coordenadas idênticas e mantém lista alternativa. QA com tiles bloqueados confirmou aviso localizado e acesso às memórias sem encerrar a sessão.
- **Objetivo/spec**: [[SPEC-1ANO-004 - Mapa e galeria]].
- **Tarefa/teste**: `memory.test.js`, `api.test.js`, `ApiIntegrationTest.paginaGaleriaEPinsSemOmitirItens` e roteiro Playwright da Spec 004.

## Questões abertas

- Nenhuma questão específica além das decisões registradas na spec vinculada.

## Histórico

| Versão | Data | Alteração | Autor |
|---|---|---|---|
| 0.1 | 2026-10-01 | Criação a partir do pedido e das fontes identificadas | IA, para revisão do autor |
| 1.0 | 2026-10-07 | Mapa real, pins agrupados, lista alternativa e falha localizada implementados e validados | IA |

## Revisão rápida

- [x] Há somente uma obrigação principal.
- [x] Condição, comportamento e resultado são observáveis.
- [x] Critérios cobrem sucesso, limite e falha.
- [x] Prioridade, origem, verificação e vínculo com a spec estão preenchidos.

