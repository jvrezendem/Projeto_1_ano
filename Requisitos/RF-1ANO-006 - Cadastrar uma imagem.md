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
fonte: "Pedido atual; limites técnicos propostos na spec"
objetivo_pai: "[[00 - Projeto 1Ano]]"
metodo_verificacao: teste e inspeção
---

# RF-1ANO-006 - Cadastrar uma imagem

## Resumo

| Campo | Valor |
|---|---|
| ID | RF-1ANO-006 |
| Tipo | Funcional |
| Prioridade | Must — proposta para o MVP |
| Status | Implementado |
| Responsável | Autor do projeto |
| Origem | Pedido atual; limites técnicos propostos na spec; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando o usuário autenticado enviar uma imagem aceita, o sistema deve persistir a foto e disponibilizá-la na coleção do casal.

## Por quê

Adicionar novas memórias sem alterar o código.

## Critérios de aceite

- [x] **Sucesso** — Dado JPEG válido dentro do limite, quando enviar a foto, então o cadastro é confirmado e a foto aparece na galeria.
- [x] **Fronteira** — Dado arquivo exatamente no limite configurado, quando enviar a foto, então o upload é aceito se as demais validações passarem.
- [x] **Falha** — Dado arquivo inválido ou maior que o limite, quando enviar a foto, então o envio é rejeitado sem criar uma memória visível.

## Regras e limites

- **Entradas/dados**: Uma imagem por envio no MVP; formatos e limites na spec.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-003 - Cadastro de fotos e metadados]].
- **Fora do escopo**: Vídeos, upload em lote e edição do arquivo de imagem.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência**: testes Spring aceitam JPEG/PNG e arquivo de 15 MiB exatos, rejeitam tipo inválido, excesso de tamanho e dimensões; QA renderizado confirma prévia, upload e inclusão na grade.
- **Objetivo/spec**: [[SPEC-1ANO-003 - Cadastro de fotos e metadados]].
- **Tarefa/teste**: `ApiIntegrationTest`, `FotoServiceTest`, `photoForm.test.js` e QA da Spec 003 cobrem `CT-RF-1ANO-006-S`, `CT-RF-1ANO-006-F` e `CT-RF-1ANO-006-E`.

## Questões abertas

- Premissa proposta nesta versão; validar no fechamento do escopo.

## Histórico

| Versão | Data | Alteração | Autor |
|---|---|---|---|
| 0.1 | 2026-10-01 | Criação a partir do pedido e das fontes identificadas | IA, para revisão do autor |
| 1.0 | 2026-10-07 | Implementação e validação dos três cenários de aceite | IA |

## Revisão rápida

- [x] Há somente uma obrigação principal.
- [x] Condição, comportamento e resultado são observáveis.
- [x] Critérios cobrem sucesso, limite e falha.
- [x] Prioridade, origem, verificação e vínculo com a spec estão preenchidos.

