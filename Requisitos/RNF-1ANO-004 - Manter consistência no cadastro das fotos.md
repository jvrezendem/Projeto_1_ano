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
fonte: "Derivado da persistência de arquivo e metadados; proposta"
objetivo_pai: "[[00 - Projeto 1Ano]]"
metodo_verificacao: teste e inspeção
---

# RNF-1ANO-004 - Manter consistência no cadastro das fotos

## Resumo

| Campo | Valor |
|---|---|
| ID | RNF-1ANO-004 |
| Tipo | Qualidade |
| Prioridade | Must — proposta para o MVP |
| Status | Implementado |
| Responsável | Autor do projeto |
| Origem | Derivado da persistência de arquivo e metadados; proposta; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando o cadastro falhar durante a persistência, o sistema deve impedir que uma foto incompleta seja exposta na galeria ou no mapa.

## Por quê

Evitar memórias sem arquivo e resíduos silenciosos no armazenamento.

## Critérios de aceite

- [x] **Sucesso** — Dado arquivo e metadados persistidos, quando concluir o upload, então uma única memória completa fica visível.
- [x] **Fronteira** — Dado EXIF ausente com imagem válida, quando concluir o upload, então a foto permanece válida com metadados desconhecidos.
- [x] **Falha** — Dado armazenamento ou banco falhar, quando concluir o upload, então nenhuma foto parcial fica visível e resíduos são removidos ou registrados para limpeza.

## Regras e limites

- **Entradas/dados**: Referência privada do arquivo, metadados e estado de publicação; compensação definida na spec.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-003 - Cadastro de fotos e metadados]].
- **Fora do escopo**: Deduplicação automática entre envios voluntários.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência**: testes do serviço impedem gravação no banco quando o storage falha, removem o arquivo quando o banco falha e reconciliam órfão com mais de 24 horas; integração confirma o caminho completo e a ausência segura de EXIF.
- **Objetivo/spec**: [[SPEC-1ANO-003 - Cadastro de fotos e metadados]].
- **Tarefa/teste**: `FotoServiceTest`, `ReconciliacaoServiceTest`, `MetadadosServiceTest` e `ApiIntegrationTest` cobrem `CT-RNF-1ANO-004-S`, `CT-RNF-1ANO-004-F` e `CT-RNF-1ANO-004-E`.

## Questões abertas

- Premissa proposta nesta versão; validar no fechamento do escopo.

## Histórico

| Versão | Data | Alteração | Autor |
|---|---|---|---|
| 0.1 | 2026-10-01 | Criação a partir do pedido e das fontes identificadas | IA, para revisão do autor |
| 1.0 | 2026-10-07 | Consistência, compensação e reconciliação implementadas e validadas | IA |

## Revisão rápida

- [x] Há somente uma obrigação principal.
- [x] Condição, comportamento e resultado são observáveis.
- [x] Critérios cobrem sucesso, limite e falha.
- [x] Prioridade, origem, verificação e vínculo com a spec estão preenchidos.

