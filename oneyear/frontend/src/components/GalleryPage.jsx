import GalleryVerticalEnd from "lucide-react/dist/esm/icons/gallery-vertical-end";

export default function GalleryPage() {
  return (
    <section className="gallery-page" aria-labelledby="gallery-title">
      <h1 id="gallery-title">Galeria</h1>
      <div className="gallery-empty" role="status">
        <GalleryVerticalEnd size={48} aria-hidden="true" />
        <h2>Suas memórias vão aparecer aqui.</h2>
        <p>A galeria reunirá as fotos em ordem cronológica quando elas forem cadastradas.</p>
      </div>
    </section>
  );
}
