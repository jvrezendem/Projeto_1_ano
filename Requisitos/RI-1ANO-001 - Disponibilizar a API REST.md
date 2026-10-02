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
fonte: "Pedido atual; contrato detalhado proposto"
objetivo_pai: "[[00 - Projeto 1Ano]]"
metodo_verificacao: teste e inspeção
---

# RI-1ANO-001 - Disponibilizar a API REST

## Resumo

| Campo | Valor |
|---|---|
| ID | RI-1ANO-001 |
| Tipo | Interface |
| Prioridade | Must — proposta para o MVP |
| Status | Proposto |
| Responsável | Autor do projeto |
| Origem | Pedido atual; contrato detalhado proposto; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando o frontend solicitar operações de autenticação, perfil ou fotos, o backend deve atendê-las por uma API REST com contratos documentados.

## Por quê

Permitir integrar o protótipo ao backend sem acoplamento ao modelo de persistência.

## Critérios de aceite

- [ ] **Sucesso** — Dado requisição válida, quando chamar a operação documentada, então status e corpo correspondem ao contrato.
- [ ] **Fronteira** — Dado consulta paginada no limite configurado, quando listar fotos, então o limite é respeitado e a resposta indica continuação.
- [ ] **Falha** — Dado entrada inválida ou falha interna, quando chamar a API, então o erro padronizado não revela senha, stack trace ou chaves internas.

## Regras e limites

- **Entradas/dados**: JSON para dados; multipart/form-data para upload; conteúdo binário em rota autenticada.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-005 - Backend Spring Boot e contratos REST]].
- **Fora do escopo**: GraphQL, WebSocket e exposição direta das entidades JPA.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência esperada**: resultado dos três cenários de aceite; execução ainda pendente.
- **Objetivo/spec**: [[SPEC-1ANO-005 - Backend Spring Boot e contratos REST]].
- **Tarefa/teste**: `CT-RI-1ANO-001-S`, `CT-RI-1ANO-001-F` e `CT-RI-1ANO-001-E` designam os cenários de sucesso, fronteira e erro; identificadores reservados, sem testes implementados.

## Questões abertas

- Premissa proposta nesta versão; validar no fechamento do escopo.

## Histórico

| Versão | Data | Alteração | Autor |
|---|---|---|---|
| 0.1 | 2026-10-01 | Criação a partir do pedido e das fontes identificadas | IA, para revisão do autor |

## Revisão rápida

- [x] Há somente uma obrigação principal.
- [x] Condição, comportamento e resultado são observáveis.
- [x] Critérios cobrem sucesso, limite e falha.
- [x] Prioridade, origem, verificação e vínculo com a spec estão preenchidos.

