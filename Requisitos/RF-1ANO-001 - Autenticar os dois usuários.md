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

# RF-1ANO-001 - Autenticar os dois usuários

## Resumo

| Campo | Valor |
|---|---|
| ID | RF-1ANO-001 |
| Tipo | Funcional |
| Prioridade | Must |
| Status | Proposto |
| Responsável | Autor do projeto |
| Origem | Pedido atual; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando uma das duas contas preexistentes informar credenciais válidas, a API deve autenticar a conta e permitir a entrada na página inicial.

## Por quê

Manter as memórias acessíveis somente ao casal.

## Critérios de aceite

- [ ] **Sucesso** — Dado uma conta provisionada, quando enviar credenciais válidas, então a sessão é estabelecida e a tela inicial é exibida.
- [ ] **Fronteira** — Dado campos de login vazios, quando tentar entrar, então o envio é impedido com indicação dos campos obrigatórios.
- [ ] **Falha** — Dado credenciais incorretas, quando tentar entrar, então o acesso é negado sem revelar se a conta existe.

## Regras e limites

- **Entradas/dados**: Identificador de login e senha; não armazenar senha no frontend.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-001 - Autenticação e perfis]].
- **Fora do escopo**: Recuperação de senha e login social.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência esperada**: resultado dos três cenários de aceite; execução ainda pendente.
- **Objetivo/spec**: [[SPEC-1ANO-001 - Autenticação e perfis]].
- **Tarefa/teste**: `CT-RF-1ANO-001-S`, `CT-RF-1ANO-001-F` e `CT-RF-1ANO-001-E` designam os cenários de sucesso, fronteira e erro; identificadores reservados, sem testes implementados.

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

