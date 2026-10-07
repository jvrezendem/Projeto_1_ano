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
fonte: "Briefing anterior e derivação das animações solicitadas"
objetivo_pai: "[[00 - Projeto 1Ano]]"
metodo_verificacao: teste e inspeção
---

# RNF-1ANO-003 - Tornar animações e controles acessíveis

## Resumo

| Campo | Valor |
|---|---|
| ID | RNF-1ANO-003 |
| Tipo | Qualidade |
| Prioridade | Must |
| Status | Parcialmente implementado |
| Responsável | Autor do projeto |
| Origem | Briefing anterior e derivação das animações solicitadas; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Durante a navegação, a interface deve permitir executar os fluxos principais por teclado e respeitar a preferência de movimento reduzido.

## Por quê

Manter a experiência utilizável sem mouse e sem efeitos que impeçam a leitura.

## Critérios de aceite

- [ ] **Sucesso** — Dado uso somente de teclado, quando abrir menu, escolher foto e fechar popup, então há foco visível e o foco retorna ao acionador.
- [x] **Fronteira** — Dado prefers-reduced-motion ativo, quando rolar a história, então o conteúdo aparece sem parallax ou movimento decorativo contínuo.
- [ ] **Falha** — Dado animação interrompida ou desativada, quando abrir e fechar um popup, então o conteúdo não fica preso nem inacessível.

## Regras e limites

- **Entradas/dados**: Login, menu, upload, galeria e popup; alternativa em lista para os pins.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-002 - História e navegação]].
- **Fora do escopo**: Certificação formal de acessibilidade.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência**: QA renderizado confirmou foco visível, foco inicial e retorno ao acionador no menu, conteúdo integral com `prefers-reduced-motion` e controle de pausa. Escolha de foto e popup permanecem pendentes das Specs 003/004.
- **Objetivo/spec**: [[SPEC-1ANO-002 - História e navegação]].
- **Tarefa/teste**: `preferences.test.js` e roteiro renderizado da Spec 002 cobrem movimento reduzido e o menu; os cenários completos de foto/popup permanecem reservados para as Specs 003/004.

## Questões abertas

- Nenhuma questão específica além das decisões registradas na spec vinculada.

## Histórico

| Versão | Data | Alteração | Autor |
|---|---|---|---|
| 0.1 | 2026-10-01 | Criação a partir do pedido e das fontes identificadas | IA, para revisão do autor |
| 0.2 | 2026-10-06 | Validação de movimento reduzido e controles existentes; foto e popup permanecem pendentes | IA |

## Revisão rápida

- [x] Há somente uma obrigação principal.
- [x] Condição, comportamento e resultado são observáveis.
- [x] Critérios cobrem sucesso, limite e falha.
- [x] Prioridade, origem, verificação e vínculo com a spec estão preenchidos.

