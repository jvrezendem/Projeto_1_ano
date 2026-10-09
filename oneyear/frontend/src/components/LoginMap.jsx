import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right";
import Heart from "lucide-react/dist/esm/icons/heart";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import Navigation from "lucide-react/dist/esm/icons/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LINK_MAPA = "https://www.openstreetmap.org/?mlat=-20.170694&mlon=-44.913306#map=17/-20.170694/-44.913306";

export default function LoginMap() {
  return (
    <aside className="login-memory-map" aria-label="Memórias e localização de onde tudo começou">
      <div className="memory-map__glow" aria-hidden="true" />

      <svg className="memory-map__roads" viewBox="0 0 900 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M-80 184C134 280 265 54 489 158s278 9 496-94" />
        <path d="M-92 664C169 553 305 763 523 628s271-133 461-7" />
        <path d="M86-62c56 192 20 320 164 435s79 306 19 675" />
        <path d="M589-38c-91 196-23 340 88 447s128 281 38 624" />
        <path d="M-28 445c164 30 248-41 389-118s300-34 568 20" />
        <path d="M173 962c51-210 153-266 307-291s237-132 352-292" />
        <circle cx="250" cy="373" r="17" />
        <circle cx="677" cy="409" r="17" />
        <circle cx="480" cy="671" r="17" />
      </svg>

      <svg className="memory-map__route" viewBox="0 0 900 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M92 790C184 657 216 603 330 578c130-29 178 45 287-53 73-66 76-166 172-218" />
      </svg>

      <figure className="memory-polaroid memory-polaroid--couple">
        <img
          src="/assets/fotos/login/memoria-casal.png"
          alt="Casal diante de um pôr do sol"
          fetchPriority="high"
        />
        <figcaption>um instante nosso</figcaption>
      </figure>

      <figure className="memory-polaroid memory-polaroid--landscape">
        <img
          src="/assets/fotos/login/memoria-paisagem.png"
          alt="Paisagem brasileira ao pôr do sol"
          loading="lazy"
        />
        <figcaption>lugares que ficam</figcaption>
      </figure>

      <Heart className="memory-map__heart memory-map__heart--one" aria-hidden="true" />
      <Heart className="memory-map__heart memory-map__heart--two" aria-hidden="true" />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              className="memory-map__pin"
              href={LINK_MAPA}
              target="_blank"
              rel="noreferrer"
              aria-label="Onde tudo começou. Abrir localização no mapa"
            >
              <span className="memory-map__pin-ring" aria-hidden="true" />
              <span className="memory-map__pin-core" aria-hidden="true">
                <Heart />
              </span>
              <span className="memory-map__pin-hint">clique</span>
            </a>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={12}>Abrir onde tudo começou</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <article className="memory-location-card">
        <div className="memory-location-card__icon" aria-hidden="true">
          <Navigation />
        </div>
        <div className="memory-location-card__copy">
          <span>Nosso ponto no mapa</span>
          <h2>Onde tudo começou.</h2>
          <p><MapPin aria-hidden="true" /> 20°10'14.5&quot;S · 44°54'47.9&quot;W</p>
        </div>
        <Separator className="memory-location-card__separator" />
        <Button asChild variant="ghost" size="sm" className="memory-location-card__action">
          <a href={LINK_MAPA} target="_blank" rel="noreferrer">
            Abrir no mapa <ArrowUpRight aria-hidden="true" />
          </a>
        </Button>
      </article>

      <p className="memory-map__signature" aria-hidden="true">amor também é direção.</p>
    </aside>
  );
}
