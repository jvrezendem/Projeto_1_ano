---
tipo: regras-ia
area: 1Ano
status: editavel
versao: 0.1
data: 2026-10-01
responsavel: Autor do projeto
tags:
  - projeto/1ano
  - tipo/regras
---

# Regras para IA — Projeto 1Ano

Este é o espaço para você escrever as regras que a IA deverá seguir no projeto. A seção **Minhas regras** começa vazia. Os campos sugeridos abaixo são opcionais e não representam decisões suas.

## Minhas regras

<!-- Escreva suas regras aqui. Prefira uma instrução clara por item. -->

## Contexto já definido por mim

Estas decisões foram extraídas do pedido atual:

- Desenvolver o backend em Java com Spring Boot, expondo uma API REST.
- Usar estrutura de pastas MVC idêntica à referência Text To SQL, conforme a árvore registrada em [[SPEC-1ANO-005 - Backend Spring Boot e contratos REST]].
- Manter somente duas contas predefinidas, com autenticação e sem cadastro.
- Implementar história, cadastro de fotos, extração de metadados, mapa com pins de coração, popup de memória, perfil e galeria.
- Usar sidebar na navegação e aproveitar o frontend existente.
- Manter a documentação deste projeto em [[00 - Projeto 1Ano]].
- NÃO ESCREVA CODIGO DESNECESSÁRIO.
- Os programas devem ser legiveis e o mais curto possivel, sem utilizar codigo desnecessário.
- Escreva no mesmo estilo de codigo da referência Text To SQL registrada em [[SPEC-1ANO-005 - Backend Spring Boot e contratos REST]]

## Campos opcionais para minhas regras

Preencha somente o que desejar tornar obrigatório. Um campo em branco não impõe restrições.

### Organização e arquitetura

Os nomes de entidades e classes devem ser em portugues utilizar camelcase e ser de facil entendimento.
Não utilize nomes sem sentido.

Siga os exemplos:

Entity: Usuario.java, Imagem.java, Livro.java
Repository: IUsuarioRepository.java
Controller: UsuarioController.java
Service: UsuarioService.java

Metodos, devem começar com letra minúscula e utilizar camelcase


### Java e Spring Boot

Ultima versão estável do Spring Boot e Java 21.

### Banco de dados e imagens

As imagens serão armazenadas em um vaut do Neon DataBase e os dados serão armazenados em um banco PostgreSQL.

### Forma de trabalho da IA

Seguir exatamente às specs. 

### Testes e definição de pronto

Testar todos os métodos.

### Git e publicação

- Não colocar tokens ou senhas.
- Criar branch develop onde todas as alterações devem acontecer.

## Como usar com uma IA

Inclua este arquivo e a spec relevante no contexto da tarefa, por exemplo:

> Leia Regras para IA.md, 00 - Projeto 1Ano.md e a spec da funcionalidade. Implemente os requisitos relacionados e diferencie decisões confirmadas das propostas ainda abertas.

Ao usar uma ferramenta que lê instruções por `AGENTS.md`, você pode copiar as regras preenchidas para um arquivo desse nome na raiz do **repositório do site**. Este documento permanece como nota editável do Obsidian; não foi criado um AGENTS.md global para o vault.

## Sugestões de regras — ainda não adotadas

Estes exemplos são apenas opções para você copiar para **Minhas regras**, adaptar ou apagar:

- Antes de implementar uma funcionalidade, ler seus requisitos e a spec vinculada.
- Não apresentar uma proposta técnica como decisão minha.
- Reaproveitar os componentes do frontend antes de criar novos.
- Registrar mudanças de contrato e atualizar os critérios de aceite afetados.
- Não inventar textos pessoais, datas, lugares ou fatos da nossa história.
- Não colocar senhas, tokens ou chaves de serviços no código ou nas notas.
- Informar o que foi alterado, o que foi verificado e o que permanece pendente.

## Registro de alterações

| Data | Regra adicionada ou alterada | Motivo |
|---|---|---|
| 2026-10-01 | Estrutura inicial, contexto confirmado e espaço livre | Preparar documento para preenchimento pelo autor |

