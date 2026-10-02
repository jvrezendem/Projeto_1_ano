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

# RF-1ANO-007 - Extrair metadados da imagem

## Resumo

| Campo | Valor |
|---|---|
| ID | RF-1ANO-007 |
| Tipo | Funcional |
| Prioridade | Must |
| Status | Proposto |
| Responsável | Autor do projeto |
| Origem | Pedido atual; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando uma imagem for cadastrada, o backend deve extrair a localização GPS e a data de captura disponíveis nos metadados, preservando a ausência de informações desconhecidas.

## Por quê

Evitar preenchimento manual quando a própria foto contém os dados.

## Critérios de aceite

- [ ] **Sucesso** — Dado JPEG com GPS e data válidos, quando cadastrar a foto, então coordenadas e data de captura são preenchidas.
- [ ] **Fronteira** — Dado imagem sem EXIF, quando cadastrar a foto, então os campos permanecem desconhecidos e o cadastro é concluído.
- [ ] **Falha** — Dado EXIF parcial ou inválido em imagem legível, quando extrair os metadados, então os campos inválidos são ignorados e o resultado sinaliza a limitação.

## Regras e limites

- **Entradas/dados**: Metadados do arquivo recebido; latitude e longitude como par; data de upload é separada.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-003 - Cadastro de fotos e metadados]].
- **Fora do escopo**: Inferir lugar ou data a partir do conteúdo visual ou nome do arquivo.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência esperada**: resultado dos três cenários de aceite; execução ainda pendente.
- **Objetivo/spec**: [[SPEC-1ANO-003 - Cadastro de fotos e metadados]].
- **Tarefa/teste**: `CT-RF-1ANO-007-S`, `CT-RF-1ANO-007-F` e `CT-RF-1ANO-007-E` designam os cenários de sucesso, fronteira e erro; identificadores reservados, sem testes implementados.

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

