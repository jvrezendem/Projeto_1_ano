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
fonte: "Suposição proposta a partir do uso pelo casal"
objetivo_pai: "[[00 - Projeto 1Ano]]"
metodo_verificacao: teste e inspeção
---

# RN-1ANO-002 - Compartilhar a coleção entre o casal

## Resumo

| Campo | Valor |
|---|---|
| ID | RN-1ANO-002 |
| Tipo | Regra |
| Prioridade | Must — proposta para o MVP |
| Status | Proposto |
| Responsável | Autor do projeto |
| Origem | Suposição proposta a partir do uso pelo casal; ver [[00 - Projeto 1Ano#Fontes e limites]] |

## Requisito

> Quando uma das duas contas cadastrar uma foto, a memória deve integrar uma coleção comum acessível às duas contas.

## Por quê

Evitar álbuns isolados em um presente sobre a história compartilhada.

## Critérios de aceite

- [ ] **Sucesso** — Dado foto cadastrada pela primeira conta, quando a segunda conta abrir a galeria, então a foto está disponível.
- [ ] **Fronteira** — Dado foto da primeira conta, quando a segunda corrigir os metadados, então a alteração é refletida na coleção comum.
- [ ] **Falha** — Dado solicitação sem autenticação, quando consultar a coleção, então o acesso é negado.

## Regras e limites

- **Entradas/dados**: Autor do envio registrado pelo backend; permissões iguais sobre a coleção nesta proposta.
- **Invariantes**: somente as duas contas autenticadas acessam o conteúdo do casal.
- **Exceções/fallback**: conforme os critérios acima e [[SPEC-1ANO-003 - Cadastro de fotos e metadados]].
- **Fora do escopo**: Álbuns privados individuais e papéis de administrador.

## Verificação e rastreabilidade

- **Método**: teste funcional e inspeção dos dados, da interface ou do código, conforme o requisito.
- **Evidência esperada**: resultado dos três cenários de aceite; execução ainda pendente.
- **Objetivo/spec**: [[SPEC-1ANO-003 - Cadastro de fotos e metadados]].
- **Tarefa/teste**: `CT-RN-1ANO-002-S`, `CT-RN-1ANO-002-F` e `CT-RN-1ANO-002-E` designam os cenários de sucesso, fronteira e erro; identificadores reservados, sem testes implementados.

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

