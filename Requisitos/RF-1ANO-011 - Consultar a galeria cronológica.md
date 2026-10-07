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
fonte: "Pedido atual e briefing anterior do frontend"
objetivo_pai: "[[00 - Projeto 1Ano]]"
metodo_verificacao: teste e inspeção
---

# RF-1ANO-011 - Consultar a galeria cronológica

## Resumo

| Campo | Valor |
|---|---|
| ID | RF-1ANO-011 |
| Tipo | Funcional |
| Prioridade | Must |
| Status | Implementado |
| Responsável | Autor do projeto |
| Origem | Pedido atual e briefing anterior do frontend; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando o usuário abrir Galeria, o sistema deve listar as fotos do casal em ordem cronológica de captura, com tratamento explícito para datas desconhecidas.

## Por quê

Permitir rever todas as fotos, inclusive aquelas sem localização.

## Critérios de aceite

- [x] **Sucesso** — Dado fotos com datas diferentes, quando abrir a galeria, então as fotos aparecem da mais antiga para a mais recente.
- [x] **Fronteira** — Dado fotos sem data de captura, quando abrir a galeria, então elas aparecem ao final em um grupo Sem data.
- [x] **Falha** — Dado falha ao carregar a próxima página, quando solicitar mais fotos, então as fotos já carregadas permanecem visíveis e é possível repetir a tentativa.

## Regras e limites

- **Entradas/dados**: Data de captura, data de envio e ID como desempate; detalhes na spec.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-004 - Mapa e galeria]].
- **Fora do escopo**: Pesquisa textual e novos filtros avançados.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência**: backend ordena e filtra a coleção completa; frontend agrupa anos/sem data, preserva filtro na URL e mantém páginas anteriores após erro.
- **Objetivo/spec**: [[SPEC-1ANO-004 - Mapa e galeria]].
- **Tarefa/teste**: `ApiIntegrationTest.paginaGaleriaEPinsSemOmitirItens`, `memory.test.js`, `api.test.js` e roteiro Playwright com 26 fotos e falha da segunda página.

## Questões abertas

- Nenhuma questão específica além das decisões registradas na spec vinculada.

## Histórico

| Versão | Data | Alteração | Autor |
|---|---|---|---|
| 0.1 | 2026-10-01 | Criação a partir do pedido e das fontes identificadas | IA, para revisão do autor |
| 1.0 | 2026-10-07 | Ordem, grupos, filtro, URL, paginação e recuperação de falha implementados e validados | IA |

## Revisão rápida

- [x] Há somente uma obrigação principal.
- [x] Condição, comportamento e resultado são observáveis.
- [x] Critérios cobrem sucesso, limite e falha.
- [x] Prioridade, origem, verificação e vínculo com a spec estão preenchidos.

