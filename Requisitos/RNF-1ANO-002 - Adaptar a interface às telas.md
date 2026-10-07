---
tipo: requisito
area: 1Ano
status: parcialmente-implementado
prioridade: Must
versao: 0.2
data: 2026-10-01
responsavel: Autor do projeto
tags:
  - tipo/requisito
  - projeto/1ano
fonte: "Briefing anterior do frontend"
objetivo_pai: "[[00 - Projeto 1Ano]]"
metodo_verificacao: teste e inspeção
---

# RNF-1ANO-002 - Adaptar a interface às telas

## Resumo

| Campo | Valor |
|---|---|
| ID | RNF-1ANO-002 |
| Tipo | Qualidade |
| Prioridade | Must |
| Status | Parcialmente implementado |
| Responsável | Autor do projeto |
| Origem | Briefing anterior do frontend; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Nas larguras de 375, 430, 768, 1024, 1366, 1440 e 1920 px, o frontend deve manter as tarefas principais utilizáveis sem rolagem horizontal da página.

## Por quê

Permitir que o presente seja usado no celular e no computador.

## Critérios de aceite

- [x] **Sucesso** — Dado cada largura prevista, quando navegar por login, história, galeria e perfil, então os elementos permanecem legíveis e acionáveis.
- [ ] **Fronteira** — Dado popup e formulário abertos em 375 px, quando interagir, então botões de confirmação e fechamento permanecem alcançáveis.
- [x] **Falha** — Dado texto longo ou imagem com falha, quando renderizar em 375 px, então o conteúdo não estoura a largura da página.

## Regras e limites

- **Entradas/dados**: Rolagem dentro do mapa não conta como rolagem horizontal da página.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-002 - História e navegação]].
- **Fora do escopo**: Layouts específicos de aplicativos nativos.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência**: QA renderizado confirmou login, história, galeria e perfil sem overflow em 375, 430, 768, 1024, 1366, 1440 e 1920 px, incluindo texto longo sem quebras e imagem com falha. O critério de popup/formulário continua pendente das Specs 003 e 004.
- **Objetivo/spec**: [[SPEC-1ANO-002 - História e navegação]].
- **Tarefa/teste**: roteiro renderizado da Spec 002 cobre `CT-RNF-1ANO-002-S` e `CT-RNF-1ANO-002-E`; `CT-RNF-1ANO-002-F` permanece reservado para o formulário e popup das Specs 003/004.

## Questões abertas

- Nenhuma questão específica além das decisões registradas na spec vinculada.

## Histórico

| Versão | Data | Alteração | Autor |
|---|---|---|---|
| 0.1 | 2026-10-01 | Criação a partir do pedido e das fontes identificadas | IA, para revisão do autor |
| 0.2 | 2026-10-06 | Validação das telas existentes nas sete larguras; popup e formulário permanecem pendentes | IA |

## Revisão rápida

- [x] Há somente uma obrigação principal.
- [x] Condição, comportamento e resultado são observáveis.
- [x] Critérios cobrem sucesso, limite e falha.
- [x] Prioridade, origem, verificação e vínculo com a spec estão preenchidos.

