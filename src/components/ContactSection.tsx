import { profile } from '@/data/profile';

export default function ContactSection() {
  return (
    <section id="scroll-target-contactme" className="relative z-10 mx-auto mt-32 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <p className="eyebrow">/ contact</p>
      <a
        href={`mailto:${profile.email}`}
        className="mt-4 inline-block break-all text-[clamp(1.5rem,5.2vw,3rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-foreground hover:text-brand"
      >
        {profile.email}
      </a>
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[13px]">
        {profile.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/70 hover:text-brand"
          >
            {link.label} ↗
          </a>
        ))}
        <a href={profile.cv} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-brand">
          CV ↓
        </a>
      </div>
    </section>
  );
}
