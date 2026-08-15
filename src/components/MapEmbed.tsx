export function MapEmbed({ query, height = 420 }: { query: string; height?: number }) {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=44.42%2C40.13%2C44.62%2C40.24&layer=mapnik&marker=40.1848%2C44.5152`;
  return (
    <div className="w-full overflow-hidden bg-surface-alt" style={{ height }}>
      <iframe
        title={query}
        src={src}
        loading="lazy"
        className="h-full w-full"
        style={{ border: 0, filter: "grayscale(1) contrast(0.95)" }}
      />
    </div>
  );
}
