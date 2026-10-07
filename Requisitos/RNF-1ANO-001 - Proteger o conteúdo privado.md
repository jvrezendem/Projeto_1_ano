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
fonte: "Derivado do login e da sensibilidade das fotos"
objetivo_pai: "[[00 - Projeto 1Ano]]"
metodo_verificacao: teste e inspeção
---

# RNF-1ANO-001 - Proteger o conteúdo privado

## Resumo

| Campo | Valor |
|---|---|
| ID | RNF-1ANO-001 |
| Tipo | Qualidade |
| Prioridade | Must |
| Status | Implementado |
| Responsável | Autor do projeto |
| Origem | Derivado do login e da sensibilidade das fotos; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando uma requisição acessar história, perfis, fotos ou localizações, o backend deve exigir uma sessão válida antes de retornar conteúdo privado.

## Por quê

Impedir acesso às memórias por chamadas diretas fora da interface.

## Critérios de aceite

- [x] **Sucesso** — Dado sessão válida, quando solicitar foto por ID, então o conteúdo é entregue.
- [x] **Fronteira** — Dado URL de imagem copiada para um navegador sem sessão, quando abrir a URL, então nenhum conteúdo privado é retornado.
- [x] **Falha** — Dado sessão inválida ou expirada, quando consultar perfil ou mapa, então a API retorna 401 sem dados privados.

## Regras e limites

- **Entradas/dados**: Rotas de conteúdo e arquivos privados; página de login contém apenas conteúdo genérico.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-005 - Backend Spring Boot e contratos REST]].
- **Fora do escopo**: Publicação pública da história ou de imagens pessoais.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência**: testes Spring negam rotas privadas sem sessão e liberam detalhe/arquivo com autenticação; mapa e galeria retornam ao login em 401. O provedor recebe somente requisições de tiles, nunca arquivos, legendas ou credenciais.
- **Objetivo/spec**: [[SPEC-1ANO-005 - Backend Spring Boot e contratos REST]].
- **Tarefa/teste**: `ApiIntegrationTest` cobre sessão válida, acesso anônimo e arquivos privados; `api.test.js` confirma cookies e `no-store`.

## Questões abertas

- Nenhuma questão específica além das decisões registradas na spec vinculada.

## Histórico

| Versão | Data | Alteração | Autor |
|---|---|---|---|
| 0.1 | 2026-10-01 | Criação a partir do pedido e das fontes identificadas | IA, para revisão do autor |
| 1.0 | 2026-10-07 | Proteção das rotas privadas e fronteira com o provedor do mapa verificadas | IA |

## Revisão rápida

- [x] Há somente uma obrigação principal.
- [x] Condição, comportamento e resultado são observáveis.
- [x] Critérios cobrem sucesso, limite e falha.
- [x] Prioridade, origem, verificação e vínculo com a spec estão preenchidos.

