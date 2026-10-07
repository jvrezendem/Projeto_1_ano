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
fonte: "Pedido atual"
objetivo_pai: "[[00 - Projeto 1Ano]]"
metodo_verificacao: teste e inspeção
---

# RF-1ANO-010 - Abrir a memória pelo pin

## Resumo

| Campo | Valor |
|---|---|
| ID | RF-1ANO-010 |
| Tipo | Funcional |
| Prioridade | Must |
| Status | Implementado |
| Responsável | Autor do projeto |
| Origem | Pedido atual; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando o usuário selecionar um pin, o frontend deve abrir um popup com a foto, o lugar e a data da memória.

## Por quê

Relembrar o momento sem sair da exploração do mapa.

## Critérios de aceite

- [x] **Sucesso** — Dado pin associado a uma foto, quando selecionar o pin, então o popup apresenta a imagem e os dados da mesma foto.
- [x] **Fronteira** — Dado foto sem nome do lugar ou data, quando abrir o popup, então coordenadas e Data não informada substituem os campos ausentes.
- [x] **Falha** — Dado falha ao carregar a imagem, quando abrir o popup, então local e data continuam disponíveis com opção de tentar novamente.

## Regras e limites

- **Entradas/dados**: Identificador da foto, conteúdo privado, nome do lugar e data de captura.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-004 - Mapa e galeria]].
- **Fora do escopo**: Edição dentro do popup.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência**: detalhe compartilhado consulta o ID selecionado, formata coordenadas/data ausente, preserva textos após falha da imagem e oferece nova tentativa.
- **Objetivo/spec**: [[SPEC-1ANO-004 - Mapa e galeria]].
- **Tarefa/teste**: `memory.test.js`, testes de contrato da API e roteiro Playwright com pin, lista, galeria, imagens quebradas e pontos coincidentes.

## Questões abertas

- Nenhuma questão específica além das decisões registradas na spec vinculada.

## Histórico

| Versão | Data | Alteração | Autor |
|---|---|---|---|
| 0.1 | 2026-10-01 | Criação a partir do pedido e das fontes identificadas | IA, para revisão do autor |
| 1.0 | 2026-10-07 | Detalhe compartilhado, fallbacks e navegação coincidente implementados e validados | IA |

## Revisão rápida

- [x] Há somente uma obrigação principal.
- [x] Condição, comportamento e resultado são observáveis.
- [x] Critérios cobrem sucesso, limite e falha.
- [x] Prioridade, origem, verificação e vínculo com a spec estão preenchidos.

