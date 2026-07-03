export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-black/10 bg-gradient-to-br from-brand-green-dark via-brand-green to-brand-green-dark text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
