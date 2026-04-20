export default function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="font-display text-sm uppercase tracking-[0.35em] text-neonSoft">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.18em] text-text md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-lg text-muted">{description}</p>
      <div className="neon-line mt-6" />
    </div>
  );
}
