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
fonte: "Derivado do acesso autenticado; proposta"
objetivo_pai: "[[00 - Projeto 1Ano]]"
metodo_verificacao: teste e inspeção
---

# RF-1ANO-002 - Encerrar a sessão

## Resumo

| Campo | Valor |
|---|---|
| ID | RF-1ANO-002 |
| Tipo | Funcional |
| Prioridade | Must — proposta para o MVP |
| Status | Proposto |
| Responsável | Autor do projeto |
| Origem | Derivado do acesso autenticado; proposta; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando o usuário acionar Sair, o sistema deve invalidar a sessão e voltar ao login.

## Por quê

Permitir encerrar o acesso em dispositivos compartilhados.

## Critérios de aceite

- [ ] **Sucesso** — Dado uma sessão ativa, quando acionar Sair, então a sessão é invalidada no servidor.
- [ ] **Fronteira** — Dado uma sessão já expirada, quando acionar Sair, então o frontend termina no login.
- [ ] **Falha** — Dado uma sessão encerrada, quando reutilizar a credencial de sessão, então a API retorna 401.

## Regras e limites

- **Entradas/dados**: Identidade da sessão atual.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-001 - Autenticação e perfis]].
- **Fora do escopo**: Encerrar remotamente sessões de outros dispositivos.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência esperada**: resultado dos três cenários de aceite; execução ainda pendente.
- **Objetivo/spec**: [[SPEC-1ANO-001 - Autenticação e perfis]].
- **Tarefa/teste**: `CT-RF-1ANO-002-S`, `CT-RF-1ANO-002-F` e `CT-RF-1ANO-002-E` designam os cenários de sucesso, fronteira e erro; identificadores reservados, sem testes implementados.

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

