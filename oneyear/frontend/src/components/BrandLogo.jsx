export default function BrandLogo({ className = "", alt = "Ana" }) {
  return (
    <img
      className={`brand-logo ${className}`.trim()}
      src="/assets/marca/logo-coracao-bussola.svg"
      alt={alt}
      width="1254"
      height="1254"
      decoding="async"
    />
  );
}
