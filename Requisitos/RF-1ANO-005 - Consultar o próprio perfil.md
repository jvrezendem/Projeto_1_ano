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

# RF-1ANO-005 - Consultar o próprio perfil

## Resumo

| Campo | Valor |
|---|---|
| ID | RF-1ANO-005 |
| Tipo | Funcional |
| Prioridade | Must |
| Status | Proposto |
| Responsável | Autor do projeto |
| Origem | Pedido atual e briefing anterior do frontend; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando o usuário autenticado abrir Perfil, o sistema deve apresentar os dados de perfil vinculados à sua conta.

## Por quê

Personalizar a experiência para cada pessoa do casal.

## Critérios de aceite

- [ ] **Sucesso** — Dado perfil preenchido, quando abrir Perfil, então nome, foto, descrição e características são exibidos.
- [ ] **Fronteira** — Dado foto ou descrição ausente, quando abrir Perfil, então um placeholder ou estado vazio é exibido.
- [ ] **Falha** — Dado falha da API, quando abrir Perfil, então a interface informa o erro e permite tentar novamente.

## Regras e limites

- **Entradas/dados**: Nome, foto opcional, descrição e características; somente dados do próprio perfil.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-001 - Autenticação e perfis]].
- **Fora do escopo**: Editar perfil, senha ou consultar o perfil da outra conta nesta versão.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência esperada**: resultado dos três cenários de aceite; execução ainda pendente.
- **Objetivo/spec**: [[SPEC-1ANO-001 - Autenticação e perfis]].
- **Tarefa/teste**: `CT-RF-1ANO-005-S`, `CT-RF-1ANO-005-F` e `CT-RF-1ANO-005-E` designam os cenários de sucesso, fronteira e erro; identificadores reservados, sem testes implementados.

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

