---
tipo: spec-feature
area: 1Ano
status: rascunho
spec_id: SPEC-1ANO-001
versao: 0.1
data: 2026-10-01
responsavel: Autor do projeto
tags:
  - tipo/spec
  - projeto/1ano
requisitos_relacionados:
  - RF-1ANO-001
  - RF-1ANO-002
  - RF-1ANO-005
  - RN-1ANO-001
  - RNF-1ANO-001
---

# SPEC-1ANO-001 - Autenticação e perfis

**Estado:** rascunho para revisão; não representa implementação concluída.
**Origem:** [[00 - Projeto 1Ano#Fontes e limites]].
**Branch:** não criada; este documento especifica o comportamento.

## Relação com os requisitos do vault

- [[RF-1ANO-001 - Autenticar os dois usuários]]
- [[RF-1ANO-002 - Encerrar a sessão]]
- [[RF-1ANO-005 - Consultar o próprio perfil]]
- [[RN-1ANO-001 - Restringir as contas ao casal]]
- [[RNF-1ANO-001 - Proteger o conteúdo privado]]

## Contexto e decisão

O site tem duas contas predefinidas e uma tela de login. Não haverá cadastro público. O perfil exibe os dados da própria conta. A autenticação real ainda precisa ser integrada ao protótipo.

**Proposta técnica:** sessão mantida pelo servidor, com cookie de sessão, usando Spring Security. Essa escolha simplifica o acesso privado às imagens no mesmo domínio. JWT não foi solicitado e não é uma decisão confirmada.

### Fronteira de responsabilidade

- **Frontend:** formulário de login, estado de sessão, perfil e ação Sair.
- **Backend:** validar credenciais, estabelecer e invalidar a sessão, identificar o usuário e proteger os recursos.
- **Autor:** definir os dois logins e conteúdos de perfil por configuração segura.

## Histórias e testes

### HU-A01 — Entrar no presente (P1)

Como integrante do casal, quero entrar com minha conta para acessar nossas memórias.

**Teste independente:** autenticar cada conta pela API, sem depender do mapa.

1. Dadas credenciais válidas, ao entrar, a sessão é estabelecida e a página inicial abre.
2. Dada senha incorreta, ao entrar, a resposta é 401 com mensagem genérica.
3. Dada sessão expirada, ao consultar o perfil, a resposta é 401 e o frontend volta ao login.

### HU-A02 — Ver meu perfil e sair (P1)

Como integrante do casal, quero reconhecer minha conta e encerrar meu acesso.

**Teste independente:** carregar o perfil com uma sessão de teste e invalidá-la.

1. Ao abrir Perfil, são exibidos nome, foto, descrição e características da própria conta.
2. Ao sair, a sessão deixa de acessar qualquer recurso privado, mesmo com a URL conhecida.
3. Ao voltar pelo histórico do navegador, dados privados não são recuperados do cache da aplicação.

### Casos de fronteira

- Sem foto de perfil: avatar padrão; descrição vazia não quebra o layout.
- Sem configuração completa das duas contas: falhar na inicialização de acesso; não criar senhas padrão.
- Provisionamento repetido: não duplicar contas nem sobrescrever hashes ou perfis.
- Reinício do servidor: nesta proposta de instância única, sessões em memória podem expirar e exigir novo login.
- Rede indisponível no logout: limpar a tela local, informar que não houve confirmação do servidor e repetir a invalidação quando houver conexão.

## Requisitos funcionais e de qualidade

Os requisitos vinculados são a fonte normativa. A implementação deve verificar autorização no servidor, proteger o conteúdo binário e não incluir dados pessoais reais no bundle público do frontend.

### Entidades principais

- **Usuario:** ID, login único, hash de senha, nome, referência da foto de perfil, descrição e características.
- **Sessão:** identidade autenticada e expiração; não contém senha.
- **PerfilResponse:** dados de exibição do usuário atual; nunca hash, senha ou configuração interna.

## Fluxo técnico proposto

1. Obter token CSRF em `GET /api/v1/auth/csrf`.
2. Enviar `POST /api/v1/auth/login` com JSON, token CSRF e cookies.
3. O backend autentica, renova o identificador de sessão e devolve somente os dados de exibição.
4. Obter novo token CSRF depois do login e consultar `GET /api/v1/me`.
5. Nas operações de escrita, enviar o token CSRF pelo header informado pelo backend.
6. Sair por `POST /api/v1/auth/logout`; invalidar sessão, expirar cookie e limpar dados privados em memória.

Cookie de sessão proposto: `HttpOnly`, `Secure` em produção e `SameSite=Lax`; produção sob HTTPS e mesma origem para frontend e API. Prazo inicial proposto de inatividade: 30 minutos, configurável. Sem opção “lembrar de mim” no MVP. Frontend e API separados em desenvolvimento exigem configuração explícita das origens e do envio de cookies.

Senhas devem ser verificadas por um `PasswordEncoder` apropriado, sem armazenamento em texto puro. Provisionar os hashes por configuração segura, sem guardá-los nas notas ou no Git. São controles propostos de implementação; o suporte de referência está na documentação oficial de [PasswordEncoder](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/password-encoder.html) e [CSRF](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html).

## Critérios de sucesso

- As duas contas válidas entram e cada uma recebe seu próprio perfil.
- Nenhum endpoint de conteúdo nem imagem devolve dados sem sessão.
- Logout invalida a sessão no backend.
- Não há rota de criação de conta nem credenciais no bundle ou no repositório.

## Suposições

- As duas contas têm as mesmas permissões sobre fotos.
- O perfil é provisionado pelo autor e consultável, sem edição pela interface.
- Uma instância de backend e mesma origem em produção são suficientes para o MVP.

## Fora do escopo

Cadastro, convites, login social, recuperação por e-mail, papéis administrativos e edição de perfil.

## Questões abertas

| ID | Questão | Responsável | Momento | Bloqueia? |
|---|---|---|---|---|
| Q-A01 | Confirmar sessão por cookie e duração de 30 minutos. | Autor | Antes da implementação de autenticação | A escolha do mecanismo |
| Q-A02 | Definir os dois identificadores e conteúdos dos perfis; fornecer credenciais fora do vault. | Autor | Antes do provisionamento real | Apenas dados reais |

## Checklist antes do planejamento

- [x] Histórias e casos de falha identificados.
- [x] Requisitos vinculados e dados privados delimitados.
- [x] Propostas diferenciadas de decisões do autor.
- [ ] Mecanismo de autenticação e dados reais definidos.


