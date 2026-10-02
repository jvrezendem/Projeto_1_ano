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
fonte: "Derivado da ausência possível de EXIF; proposta"
objetivo_pai: "[[00 - Projeto 1Ano]]"
metodo_verificacao: teste e inspeção
---

# RF-1ANO-008 - Complementar os dados da foto

## Resumo

| Campo | Valor |
|---|---|
| ID | RF-1ANO-008 |
| Tipo | Funcional |
| Prioridade | Must — proposta para o MVP |
| Status | Proposto |
| Responsável | Autor do projeto |
| Origem | Derivado da ausência possível de EXIF; proposta; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando o usuário revisar uma foto, o sistema deve permitir informar ou corrigir local, coordenadas e data da memória.

## Por quê

Tornar utilizáveis fotos recebidas por aplicativos que removem metadados.

## Critérios de aceite

- [ ] **Sucesso** — Dado foto sem localização, quando salvar coordenadas válidas e nome do lugar, então a foto passa a ter localização para o mapa.
- [ ] **Fronteira** — Dado latitude -90 e longitude 180, quando salvar a localização, então os limites válidos são aceitos.
- [ ] **Falha** — Dado latitude fora do intervalo ou coordenada sem seu par, quando salvar, então a API rejeita os dados e preserva a versão anterior.

## Regras e limites

- **Entradas/dados**: Nome do lugar, par de coordenadas, data opcional e legenda; origem manual registrada.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-003 - Cadastro de fotos e metadados]].
- **Fora do escopo**: Busca automática de endereços obrigatória e exclusão de fotos.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência esperada**: resultado dos três cenários de aceite; execução ainda pendente.
- **Objetivo/spec**: [[SPEC-1ANO-003 - Cadastro de fotos e metadados]].
- **Tarefa/teste**: `CT-RF-1ANO-008-S`, `CT-RF-1ANO-008-F` e `CT-RF-1ANO-008-E` designam os cenários de sucesso, fronteira e erro; identificadores reservados, sem testes implementados.

## Questões abertas

- Premissa proposta nesta versão; validar no fechamento do escopo.

## Histórico

| Versão | Data | Alteração | Autor |
|---|---|---|---|
| 0.1 | 2026-10-01 | Criação a partir do pedido e das fontes identificadas | IA, para revisão do autor |

## Revisão rápida

- [x] Há somente uma obrigação principal.
- [x] Condição, comportamento e resultado são observáveis.
- [x] Critérios cobrem sucesso, limite e falha.
- [x] Prioridade, origem, verificação e vínculo com a spec estão preenchidos.

