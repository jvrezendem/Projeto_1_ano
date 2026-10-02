---
tipo: requisito
area: 1Ano
status: proposto
prioridade: Must
versao: 0.1
data: 2026-10-01
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
| Status | Proposto |
| Responsável | Autor do projeto |
| Origem | Pedido atual e briefing anterior do frontend; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando o usuário abrir Galeria, o sistema deve listar as fotos do casal em ordem cronológica de captura, com tratamento explícito para datas desconhecidas.

## Por quê

Permitir rever todas as fotos, inclusive aquelas sem localização.

## Critérios de aceite

- [ ] **Sucesso** — Dado fotos com datas diferentes, quando abrir a galeria, então as fotos aparecem da mais antiga para a mais recente.
- [ ] **Fronteira** — Dado fotos sem data de captura, quando abrir a galeria, então elas aparecem ao final em um grupo Sem data.
- [ ] **Falha** — Dado falha ao carregar a próxima página, quando solicitar mais fotos, então as fotos já carregadas permanecem visíveis e é possível repetir a tentativa.

## Regras e limites

- **Entradas/dados**: Data de captura, data de envio e ID como desempate; detalhes na spec.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-004 - Mapa e galeria]].
- **Fora do escopo**: Pesquisa textual e novos filtros avançados.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência esperada**: resultado dos três cenários de aceite; execução ainda pendente.
- **Objetivo/spec**: [[SPEC-1ANO-004 - Mapa e galeria]].
- **Tarefa/teste**: `CT-RF-1ANO-011-S`, `CT-RF-1ANO-011-F` e `CT-RF-1ANO-011-E` designam os cenários de sucesso, fronteira e erro; identificadores reservados, sem testes implementados.

## Questões abertas

- Nenhuma questão específica além das decisões registradas na spec vinculada.

## Histórico

| Versão | Data | Alteração | Autor |
|---|---|---|---|
| 0.1 | 2026-10-01 | Criação a partir do pedido e das fontes identificadas | IA, para revisão do autor |

## Revisão rápida

- [x] Há somente uma obrigação principal.
- [x] Condição, comportamento e resultado são observáveis.
- [x] Critérios cobrem sucesso, limite e falha.
- [x] Prioridade, origem, verificação e vínculo com a spec estão preenchidos.

