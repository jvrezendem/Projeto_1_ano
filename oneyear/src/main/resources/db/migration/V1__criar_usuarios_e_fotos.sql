create table usuarios (
    id uuid primary key,
    login varchar(80) not null unique,
    senha_hash varchar(100) not null,
    nome varchar(120) not null,
    avatar_key varchar(255) unique,
    descricao varchar(1000)
);

create table usuario_caracteristicas (
    usuario_id uuid not null references usuarios(id) on delete cascade,
    caracteristicas varchar(255)
);

create table fotos (
    id uuid primary key,
    autor_id uuid not null references usuarios(id),
    storage_key varchar(255) not null unique,
    content_type varchar(30) not null,
    tamanho bigint not null check (tamanho > 0),
    largura integer not null check (largura > 0),
    altura integer not null check (altura > 0),
    legenda varchar(500),
    lugar varchar(120),
    latitude numeric(10, 7),
    longitude numeric(10, 7),
    data_captura date,
    hora_captura time,
    offset_captura varchar(10),
    origem_localizacao varchar(10) not null check (origem_localizacao in ('EXIF', 'MANUAL', 'AUSENTE')),
    origem_data varchar(10) not null check (origem_data in ('EXIF', 'MANUAL', 'AUSENTE')),
    criado_em timestamp with time zone not null,
    atualizado_em timestamp with time zone not null,
    constraint ck_fotos_coordenadas_pares check (
        (latitude is null and longitude is null) or
        (latitude is not null and longitude is not null and
         latitude between -90 and 90 and longitude between -180 and 180)
    )
);

create index idx_fotos_galeria on fotos (data_captura, criado_em, id);
create index idx_fotos_pins on fotos (id) where latitude is not null and longitude is not null;
