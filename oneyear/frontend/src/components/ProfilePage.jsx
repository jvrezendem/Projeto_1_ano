import { useState } from "react";
import Heart from "lucide-react/dist/esm/icons/heart";
import UserRound from "lucide-react/dist/esm/icons/user-round";
import { urlDaApi } from "../api";

function iniciais(nome) {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("");
}

export default function ProfilePage({ perfil }) {
  const [avatarFalhou, setAvatarFalhou] = useState(false);
  const temAvatar = Boolean(perfil.avatarUrl) && !avatarFalhou;
  const caracteristicas = perfil.caracteristicas || [];

  return (
    <section className="profile-page" aria-labelledby="profile-title">
      <h1 id="profile-title">Meu perfil</h1>
      <div className="profile-identity">
        <div className="avatar">
          {temAvatar ? (
            <img src={urlDaApi(perfil.avatarUrl)} alt={`Foto de perfil de ${perfil.nome}`} onError={() => setAvatarFalhou(true)} />
          ) : iniciais(perfil.nome) ? (
            <span aria-label={`Avatar de ${perfil.nome}`}>{iniciais(perfil.nome)}</span>
          ) : (
            <UserRound size={72} aria-label="Avatar padrão" />
          )}
          <Heart className="avatar-heart" size={20} fill="currentColor" aria-hidden="true" />
        </div>
        <div>
          <h2>{perfil.nome}</h2>
          <p>{perfil.descricao || "Nenhuma descrição informada."}</p>
        </div>
      </div>

      <div className="profile-traits">
        <h2>Características</h2>
        {caracteristicas.length ? (
          <ul>
            {caracteristicas.map((caracteristica) => <li key={caracteristica}>{caracteristica}</li>)}
          </ul>
        ) : (
          <div className="profile-empty" role="status">
            <Heart size={42} aria-hidden="true" />
            <p>Nenhuma característica informada.</p>
          </div>
        )}
      </div>
    </section>
  );
}
