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
fonte: "Pedido atual"
objetivo_pai: "[[00 - Projeto 1Ano]]"
metodo_verificacao: teste e inspeção
---

# RN-1ANO-001 - Restringir as contas ao casal

## Resumo

| Campo | Valor |
|---|---|
| ID | RN-1ANO-001 |
| Tipo | Regra |
| Prioridade | Must |
| Status | Proposto |
| Responsável | Autor do projeto |
| Origem | Pedido atual; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Durante a operação do sistema, somente as duas contas predefinidas devem existir como contas de acesso, sem fluxo público de cadastro.

## Por quê

Manter o projeto pessoal e evitar cadastro aberto.

## Critérios de aceite

- [ ] **Sucesso** — Dado provisionamento inicial concluído, quando consultar as contas habilitadas em teste, então existem exatamente duas identidades distintas.
- [ ] **Fronteira** — Dado reinicialização do backend, quando executar o provisionamento novamente, então as duas contas são preservadas sem duplicação.
- [ ] **Falha** — Dado configuração de contas incompleta ou duplicada, quando inicializar o sistema, então a inicialização de acesso falha com erro de configuração sem criar contas padrão.

## Regras e limites

- **Entradas/dados**: Identidades e hashes de senha configurados fora do código; detalhes na spec.
- **Invariantes**: exatamente duas contas predefinidas, sem cadastro público.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-001 - Autenticação e perfis]].
- **Fora do escopo**: Cadastro, convite, administração de usuários e recuperação por e-mail.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência esperada**: resultado dos três cenários de aceite; execução ainda pendente.
- **Objetivo/spec**: [[SPEC-1ANO-001 - Autenticação e perfis]].
- **Tarefa/teste**: `CT-RN-1ANO-001-S`, `CT-RN-1ANO-001-F` e `CT-RN-1ANO-001-E` designam os cenários de sucesso, fronteira e erro; identificadores reservados, sem testes implementados.

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

