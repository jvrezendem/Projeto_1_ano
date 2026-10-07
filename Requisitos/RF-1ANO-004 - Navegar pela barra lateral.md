---
tipo: requisito
area: 1Ano
status: implementado
prioridade: Must
versao: 1.0
data: 2026-10-01
responsavel: Autor do projeto
tags:
  - tipo/requisito
  - projeto/1ano
fonte: "Pedido atual; prevalece sobre a topbar do protótipo"
objetivo_pai: "[[00 - Projeto 1Ano]]"
metodo_verificacao: teste e inspeção
---

# RF-1ANO-004 - Navegar pela barra lateral

## Resumo

| Campo | Valor |
|---|---|
| ID | RF-1ANO-004 |
| Tipo | Funcional |
| Prioridade | Must |
| Status | Implementado |
| Responsável | Autor do projeto |
| Origem | Pedido atual; prevalece sobre a topbar do protótipo; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando o usuário selecionar uma opção da barra lateral, o frontend deve abrir a página Inicial, Galeria ou Perfil correspondente.

## Por quê

Facilitar o acesso às áreas principais sem perder a continuidade visual.

## Critérios de aceite

- [x] **Sucesso** — Dado uma sessão ativa, quando selecionar Galeria, então a galeria abre e a opção fica marcada como ativa.
- [x] **Fronteira** — Dado viewport de 375 px, quando abrir o menu, então as mesmas opções ficam acessíveis em menu recolhível.
- [x] **Falha** — Dado sessão expirada, quando selecionar uma área protegida, então o usuário é encaminhado ao login.

## Regras e limites

- **Entradas/dados**: Opções Inicial, Galeria, Perfil e Sair.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-002 - História e navegação]].
- **Fora do escopo**: Novas áreas de navegação não especificadas.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência**: QA renderizado navegou por Inicial, Galeria e Perfil, conferiu o item ativo, exercitou o drawer em 375 px e simulou expiração da sessão com retorno ao login.
- **Objetivo/spec**: [[SPEC-1ANO-002 - História e navegação]].
- **Tarefa/teste**: roteiro renderizado da Spec 002 cobre `CT-RF-1ANO-004-S`, `CT-RF-1ANO-004-F` e `CT-RF-1ANO-004-E`.

## Questões abertas

- Nenhuma questão específica além das decisões registradas na spec vinculada.

## Histórico

| Versão | Data | Alteração | Autor |
|---|---|---|---|
| 0.1 | 2026-10-01 | Criação a partir do pedido e das fontes identificadas | IA, para revisão do autor |
| 1.0 | 2026-10-06 | Implementação e validação dos três cenários de aceite | IA |

## Revisão rápida

- [x] Há somente uma obrigação principal.
- [x] Condição, comportamento e resultado são observáveis.
- [x] Critérios cobrem sucesso, limite e falha.
- [x] Prioridade, origem, verificação e vínculo com a spec estão preenchidos.

