---
tipo: spec-feature
area: 1Ano
status: rascunho
spec_id: SPEC-1ANO-003
versao: 0.1
data: 2026-10-01
responsavel: Autor do projeto
tags:
  - tipo/spec
  - projeto/1ano
requisitos_relacionados:
  - RF-1ANO-006
  - RF-1ANO-007
  - RF-1ANO-008
  - RN-1ANO-002
  - RNF-1ANO-004
---

# SPEC-1ANO-003 - Cadastro de fotos e metadados

**Estado:** rascunho para revisão; não representa implementação concluída.
**Origem:** [[00 - Projeto 1Ano#Fontes e limites]].
**Branch:** não criada; este documento especifica o comportamento.

## Relação com os requisitos do vault

- [[RF-1ANO-006 - Cadastrar uma imagem]]
- [[RF-1ANO-007 - Extrair metadados da imagem]]
- [[RF-1ANO-008 - Complementar os dados da foto]]
- [[RN-1ANO-002 - Compartilhar a coleção entre o casal]]
- [[RNF-1ANO-004 - Manter consistência no cadastro das fotos]]

## Contexto e decisão

A foto é a unidade principal de memória. O usuário envia um arquivo, o backend extrai os metadados disponíveis e a foto entra na galeria. Quando houver coordenadas válidas, ela também fica disponível no mapa.

**Propostas desta versão:** coleção compartilhada, complementação manual dos dados, um arquivo por envio, PostgreSQL para registros e armazenamento privado separado para imagens. Provedor ainda não escolhido. Essas decisões complementam o pedido e estão abertas à revisão.

### Fronteira de responsabilidade

- **Frontend:** seleção, prévia, envio, revisão e feedback.
- **Backend:** validação real do arquivo, extração de metadados, persistência e autorização.
- **Armazenamento:** bytes privados; não expor um bucket público.
- **Usuário:** confirmar ou corrigir informações ausentes ou incorretas.

## Histórias e testes

### HU-F01 — Adicionar uma memória (P1)

Como integrante do casal, quero enviar uma foto para que ela apareça na coleção.

**Teste independente:** enviar uma imagem pela API e recuperar seu conteúdo por uma rota autenticada.

1. Arquivo aceito gera resposta 201 com ID e dados extraídos.
2. Arquivo fora dos limites gera erro e nenhuma memória visível.
3. Ao recarregar a galeria, a foto continua disponível para ambas as contas.

### HU-F02 — Localizar automaticamente uma lembrança (P1)

Como integrante do casal, quero aproveitar GPS e data da foto sem preenchê-los novamente.

**Teste independente:** usar arquivos de teste com EXIF conhecido, sem depender do provedor de mapa.

1. GPS sul/oeste é convertido para valores negativos.
2. Foto sem GPS entra na galeria com localização ausente.
3. EXIF inválido não impede salvar uma imagem decodificável.
4. Uma data sem fuso não recebe um fuso inventado.

### HU-F03 — Completar uma memória (P1, proposta)

Como integrante do casal, quero corrigir os dados para usar fotos sem metadados.

**Teste independente:** alterar uma foto sem GPS e consultar novamente seu DTO.

1. Ao informar coordenadas válidas, a memória passa a ser elegível para o mapa.
2. Nome do lugar sem coordenadas não cria um pin.
3. Data inválida ou coordenadas incompletas são rejeitadas sem alteração parcial.

## Fluxo principal

1. Usuário seleciona um arquivo pela galeria e vê uma prévia local.
2. Frontend envia o arquivo original; não remover EXIF antes da extração no backend.
3. Backend autentica, valida tamanho, assinatura de conteúdo e decodificação.
4. Backend extrai GPS e data quando disponíveis.
5. Arquivo e registro são persistidos; somente a foto completa fica disponível para leitura.
6. API responde 201; frontend abre uma revisão opcional de lugar, data e legenda.
7. Ao salvar uma correção, galeria, detalhe e mapa refletem a mesma versão da memória.

## Requisitos e regras de dados

### Limites iniciais propostos

| Campo | Regra |
|---|---|
| Arquivo | Um JPEG ou PNG; tipo real validado, não apenas extensão ou Content-Type |
| Tamanho | Até 15 MiB por arquivo, inclusive; corpo multipart pode ter margem para overhead |
| Imagem decodificada | Até 40 milhões de pixels; impor também limites de recursos no decoder |
| Lugar | Opcional, até 120 caracteres |
| Legenda | Opcional, até 500 caracteres; texto simples |
| Latitude | Decimal entre -90 e 90, inclusive |
| Longitude | Decimal entre -180 e 180, inclusive |
| Coordenadas | Ambas presentes ou ambas nulas; (0, 0) é um par válido |
| Data | Data civil válida; opcional; não confundir com a data de envio |

JPEG e PNG formam um ponto de partida para o MVP. PNG sem metadados continua aceito. HEIC/HEIF, WebP e outros formatos ficam pendentes de decisão e validação de biblioteca, sem conversão automática silenciosa.

### Extração e precedência

- GPS: converter graus/minutos/segundos e referências N/S/E/W para graus decimais; rejeitar pares incompletos ou fora de faixa.
- Captura: priorizar o campo de data original da foto; hora e offset, quando válidos e disponíveis, são informações separadas.
- Ausência ou erro em um campo não invalida os demais metadados válidos.
- Correção manual prevalece sobre o valor extraído e registra sua origem.
- A data de envio é gerada pelo servidor em UTC e nunca é apresentada como se fosse a data de captura.
- Datas de captura são exibidas como datas civis, sem deslocá-las por conversão automática de fuso.
- EXIF não garante nome de cidade ou estabelecimento. O nome do lugar pode ser preenchido manualmente; geocodificação reversa é uma possibilidade futura.
- Não solicitar GPS atual do dispositivo para substituir automaticamente o GPS ausente da foto.

### Entidades principais

**Foto:** ID, autor do envio, chave privada do arquivo, tipo real, tamanho, dimensões, legenda, lugar, latitude, longitude, data de captura, hora/offset opcionais, origem dos campos e datas de criação/atualização.

Origens de localização e data são independentes: `EXIF`, `MANUAL` ou `AUSENTE`. Para a data sem informação, usar `null`, não uma data padrão.

### Persistência e falhas

O banco e o armazenamento não compartilham uma transação única. O serviço precisa tratar explicitamente a compensação:

1. Gerar uma chave de arquivo sem reutilizar o nome enviado como caminho.
2. Persistir o arquivo privado e gravar o registro em transação de banco.
3. Expor a memória somente depois da confirmação dos dois passos.
4. Se o banco falhar, tentar remover o arquivo. Se a remoção falhar, registrar a chave para limpeza posterior.
5. Uma rotina de reconciliação deve localizar arquivos órfãos, inclusive após queda do processo entre os passos. Prazo inicial proposto: até 24 horas.
6. Se o armazenamento falhar, não confirmar o cadastro no banco nem retornar sucesso.

Falha na extração de EXIF é um aviso de metadados, não falha de upload, desde que a imagem seja válida. Falha na resposta de rede após um possível sucesso exige consulta à galeria antes de novo envio; não repetir uploads automaticamente. Duplicatas por envios voluntários são permitidas no MVP.

## Critérios de sucesso

- JPEG com EXIF, imagem sem EXIF e imagem com EXIF inválido legível percorrem os caminhos esperados.
- Fotos sem localização aparecem apenas na galeria.
- Correção de coordenadas atualiza a elegibilidade do pin.
- Falhas simuladas do banco e do armazenamento não expõem registros incompletos.
- Arquivos inválidos, grandes demais ou com dimensões excessivas são rejeitados.

## Suposições

- As duas contas podem cadastrar e corrigir dados de qualquer foto da coleção comum.
- Arquivos ficam fora das tabelas relacionais; o banco guarda a referência.
- O nome do local pode ser informado manualmente, sem serviço externo de geocodificação no MVP.

## Fora do escopo

Upload em lote, vídeos, edição/corte de imagens, remoção de fotos pela interface, reconhecimento facial, inferência de lugar por IA e detecção automática de duplicatas.

## Questões abertas

| ID | Questão | Responsável | Momento | Bloqueia? |
|---|---|---|---|---|
| Q-F01 | Confirmar formatos, 15 MiB e 40 MP; verificar se o acervo exige HEIC. | Autor | Antes do parser/upload | Formatos finais |
| Q-F02 | Escolher armazenamento privado e ambiente de persistência. | Autor | Antes da implementação de armazenamento | Persistência real |
| Q-F03 | Confirmar coleção compartilhada e edição por ambas as contas. | Autor | Antes das permissões de escrita | Política de edição |

## Checklist antes do planejamento

- [x] Fluxo de upload e extração especificado.
- [x] Ausência de GPS/data e precedência manual definidas.
- [x] Falhas entre banco e arquivo consideradas.
- [ ] Formatos, armazenamento e permissões validados.


