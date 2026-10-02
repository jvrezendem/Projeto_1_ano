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
fonte: "Pedido anterior recuperado; preservação do protótipo"
objetivo_pai: "[[00 - Projeto 1Ano]]"
metodo_verificacao: teste e inspeção
---

# RF-1ANO-012 - Alternar os temas claro e escuro

## Resumo

| Campo | Valor |
|---|---|
| ID | RF-1ANO-012 |
| Tipo | Funcional |
| Prioridade | Must |
| Status | Proposto |
| Responsável | Autor do projeto |
| Origem | Pedido anterior recuperado; preservação do protótipo; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando o usuário alternar o tema, o frontend deve aplicar o modo claro ou escuro às telas e aos componentes.

## Por quê

Preservar uma capacidade já prevista no protótipo.

## Critérios de aceite

- [ ] **Sucesso** — Dado tema claro ativo, quando alternar o tema, então página, menu, popup e formulários adotam o tema escuro.
- [ ] **Fronteira** — Dado preferência do tema salva, quando reabrir o site, então a preferência é restaurada.
- [ ] **Falha** — Dado armazenamento local indisponível, quando trocar o tema, então a troca funciona durante a sessão da página.

## Regras e limites

- **Entradas/dados**: Preferência visual local; não contém credenciais.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-002 - História e navegação]].
- **Fora do escopo**: Sincronização do tema entre dispositivos.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência esperada**: resultado dos três cenários de aceite; execução ainda pendente.
- **Objetivo/spec**: [[SPEC-1ANO-002 - História e navegação]].
- **Tarefa/teste**: `CT-RF-1ANO-012-S`, `CT-RF-1ANO-012-F` e `CT-RF-1ANO-012-E` designam os cenários de sucesso, fronteira e erro; identificadores reservados, sem testes implementados.

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

