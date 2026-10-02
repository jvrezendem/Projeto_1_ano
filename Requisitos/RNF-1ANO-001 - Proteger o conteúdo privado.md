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
| Status | Proposto |
| Responsável | Autor do projeto |
| Origem | Derivado do login e da sensibilidade das fotos; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando uma requisição acessar história, perfis, fotos ou localizações, o backend deve exigir uma sessão válida antes de retornar conteúdo privado.

## Por quê

Impedir acesso às memórias por chamadas diretas fora da interface.

## Critérios de aceite

- [ ] **Sucesso** — Dado sessão válida, quando solicitar foto por ID, então o conteúdo é entregue.
- [ ] **Fronteira** — Dado URL de imagem copiada para um navegador sem sessão, quando abrir a URL, então nenhum conteúdo privado é retornado.
- [ ] **Falha** — Dado sessão inválida ou expirada, quando consultar perfil ou mapa, então a API retorna 401 sem dados privados.

## Regras e limites

- **Entradas/dados**: Rotas de conteúdo e arquivos privados; página de login contém apenas conteúdo genérico.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-005 - Backend Spring Boot e contratos REST]].
- **Fora do escopo**: Publicação pública da história ou de imagens pessoais.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência esperada**: resultado dos três cenários de aceite; execução ainda pendente.
- **Objetivo/spec**: [[SPEC-1ANO-005 - Backend Spring Boot e contratos REST]].
- **Tarefa/teste**: `CT-RNF-1ANO-001-S`, `CT-RNF-1ANO-001-F` e `CT-RNF-1ANO-001-E` designam os cenários de sucesso, fronteira e erro; identificadores reservados, sem testes implementados.

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

