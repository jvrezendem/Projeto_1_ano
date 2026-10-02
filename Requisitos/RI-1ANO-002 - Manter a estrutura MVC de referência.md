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
fonte: "Pedido atual e inspeção da cópia local do Text To SQL"
objetivo_pai: "[[00 - Projeto 1Ano]]"
metodo_verificacao: teste e inspeção
---

# RI-1ANO-002 - Manter a estrutura MVC de referência

## Resumo

| Campo | Valor |
|---|---|
| ID | RI-1ANO-002 |
| Tipo | Interface |
| Prioridade | Must |
| Status | Proposto |
| Responsável | Autor do projeto |
| Origem | Pedido atual e inspeção da cópia local do Text To SQL; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando o backend for implementado, o projeto deve usar Java com Spring Boot e reproduzir os diretórios MVC encontrados no projeto de referência, ajustando o pacote base e as classes ao domínio 1Ano.

## Por quê

Manter a organização familiar de desenvolvimento solicitada pelo autor.

## Critérios de aceite

- [ ] **Sucesso** — Dado estrutura de referência registrada, quando inspecionar o backend, então existem controller, service, database/models, database/repository, config, exception e handler.
- [ ] **Fronteira** — Dado novo domínio de fotos, quando adicionar classes, então elas ficam nas camadas correspondentes sem copiar as entidades de futebol.
- [ ] **Falha** — Dado necessidade de nova pasta não prevista, quando planejar a implementação, então a diferença é registrada na spec antes de alterar a estrutura.

## Regras e limites

- **Entradas/dados**: Raiz Maven project/ e src/main/java; árvore e responsabilidades na spec de backend.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-005 - Backend Spring Boot e contratos REST]].
- **Fora do escopo**: Trocar MVC por arquitetura hexagonal, microsserviços ou organização por feature.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência esperada**: resultado dos três cenários de aceite; execução ainda pendente.
- **Objetivo/spec**: [[SPEC-1ANO-005 - Backend Spring Boot e contratos REST]].
- **Tarefa/teste**: `CT-RI-1ANO-002-S`, `CT-RI-1ANO-002-F` e `CT-RI-1ANO-002-E` designam os cenários de sucesso, fronteira e erro; identificadores reservados, sem testes implementados.

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

