# Guia de imagens

Os arquivos desta pasta são servidos pelo frontend a partir de `/assets/...`.

## Marca

- `marca/logo-coracao-bussola.svg`: logo usada em todas as telas.

## Fotos da história

Coloque as imagens abaixo com estes nomes exatos:

- `fotos/historia/destaque-principal.jpg`: imagem grande e arqueada da página inicial.
- `fotos/historia/destaque-polaroid.jpg`: fotografia inclinada sobre a imagem principal.

Enquanto um arquivo não existir, o próprio site mostra um cartão com o caminho em que ele deve ser colocado. Prefira imagens JPG em alta resolução e orientação paisagem. As imagens se adaptam automaticamente ao espaço com `object-fit: cover`.

## Fotos enviadas pelos usuários

Fotos de perfil e fotos da galeria **não devem ser copiadas manualmente para esta pasta**. Cada pessoa envia sua foto de perfil pela tela **Perfil**, e as memórias são enviadas pela **Galeria**. Esses arquivos ficam no armazenamento privado configurado no backend.

## Exemplo preservado

- `fotos/exemplo/login-memories.png`: imagem antiga mantida apenas como referência; não é usada automaticamente pelo site.

## Composição da tela de login

- `fotos/login/memoria-casal.png`: polaroid superior do casal.
- `fotos/login/memoria-paisagem.png`: polaroid inferior da paisagem.

Essas duas imagens podem ser substituídas mantendo exatamente os mesmos nomes. Use arquivos PNG ou renomeie também o caminho em `src/components/LoginMap.jsx`; o recorte é responsivo e feito automaticamente com `object-fit: cover`.
