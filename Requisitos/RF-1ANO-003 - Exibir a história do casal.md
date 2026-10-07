---
tipo: requisito
area: 1Ano
status: implementado
prioridade: Must
versao: 1.0
data: 2026-10-01
responsavel: Autor do projeto
tags:
  - tipo/requisito
  - projeto/1ano
fonte: "Pedido atual"
objetivo_pai: "[[00 - Projeto 1Ano]]"
metodo_verificacao: teste e inspeção
---

# RF-1ANO-003 - Exibir a história do casal

## Resumo

| Campo | Valor |
|---|---|
| ID | RF-1ANO-003 |
| Tipo | Funcional |
| Prioridade | Must |
| Status | Implementado |
| Responsável | Autor do projeto |
| Origem | Pedido atual; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando o usuário autenticado abrir a página inicial, o frontend deve apresentar a história do casal em uma sequência vertical de seções.

## Por quê

Transformar o site em um presente pessoal e permitir reviver o primeiro ano.

## Critérios de aceite

- [x] **Sucesso** — Dado conteúdo real configurado, quando abrir a página inicial, então a frase de destaque e a história aparecem na ordem definida.
- [x] **Fronteira** — Dado nenhuma foto cadastrada, quando abrir a história, então os textos continuam disponíveis.
- [x] **Falha** — Dado falha ao carregar uma foto, quando ler a história, então o texto continua legível com indicação de imagem indisponível.

## Regras e limites

- **Entradas/dados**: Frase, textos, ordem e referências de fotos definidos pelo autor.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-002 - História e navegação]].
- **Fora do escopo**: Editor de história dentro do site.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência**: teste de integração confirma frase, introdução, dicas e ordenação; QA renderizado confirmou conteúdo sem foto e fallback de imagem quebrada sem perda do texto.
- **Objetivo/spec**: [[SPEC-1ANO-002 - História e navegação]].
- **Tarefa/teste**: `ApiIntegrationTest` e roteiro renderizado da Spec 002 cobrem `CT-RF-1ANO-003-S`, `CT-RF-1ANO-003-F` e `CT-RF-1ANO-003-E`.

## Questões abertas

- Nenhuma questão específica além das decisões registradas na spec vinculada.

## Histórico

| Versão | Data | Alteração | Autor |
|---|---|---|---|
| 0.1 | 2026-10-01 | Criação a partir do pedido e das fontes identificadas | IA, para revisão do autor |
| 1.0 | 2026-10-06 | Implementação e validação dos três cenários de aceite | IA |

## Revisão rápida

- [x] Há somente uma obrigação principal.
- [x] Condição, comportamento e resultado são observáveis.
- [x] Critérios cobrem sucesso, limite e falha.
- [x] Prioridade, origem, verificação e vínculo com a spec estão preenchidos.

