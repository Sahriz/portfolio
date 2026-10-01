import Image from 'next/image';
import SectionHeader from './SectionHeader';
import ScrollReveal from './ScrollReveal';
import { buttonVariants } from '@/components/ui/button';
import { profile } from '@/data/profile';
import { skillGroups } from '@/data/skills';

export default function About() {
  return (
    <section id="scroll-target-aboutme" className="relative z-10 mx-auto mt-32 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="/ background" title="About" />

      <div className="grid items-start gap-7 lg:grid-cols-[260px_1fr_1.1fr] lg:gap-11">
        {/* Left column: photo, then the short "now" facts and the CV. Keeping
            these under the photo, not under the bio, is what makes the three
            columns end at about the same height. */}
        <ScrollReveal>
          {profile.photo ? (
            <div className="relative aspect-[4/5] w-full max-w-[220px] border border-foreground/15 lg:max-w-none">
              <Image src={profile.photo} alt={profile.name} fill sizes="260px" className="object-cover" />
            </div>
          ) : (
            // Placeholder until there is a headshot: set `photo` in data/profile.ts.
            <div className="photo-placeholder grid aspect-[4/5] w-full max-w-[220px] place-items-center lg:max-w-none border border-dashed border-foreground/30 font-mono text-xs text-foreground/50">
              your photo
            </div>
          )}
          <dl className="mt-5 flex flex-col gap-3 font-mono text-[12.5px] leading-[1.5]">
            {profile.now.map((row) => (
              <div key={row.label}>
                <dt className="text-foreground/45">{row.label}</dt>
                <dd className="text-foreground/85">{row.value}</dd>
              </div>
            ))}
          </dl>
          <a
            href={profile.cv}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: 'sm', className: 'mt-5' })}
          >
            download cv ↓
          </a>
        </ScrollReveal>

        <ScrollReveal delay={90}>
          {profile.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mb-3.5 text-base leading-[1.65] text-foreground/75 last:mb-0">
              {paragraph}
            </p>
          ))}
        </ScrollReveal>

        <ScrollReveal delay={180} className="grid grid-cols-2 gap-3.5">
          {skillGroups.map((group) => (
            <div key={group.title} className="border border-foreground/10 surface-faint px-[18px] py-4">
              <h3 className="mb-3 border-b border-foreground/10 pb-2.5 text-sm font-semibold leading-[1.2] text-foreground">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li key={item.name} className="flex items-center gap-2.5 font-mono text-[13px] leading-[1.3] text-foreground/75">
                    {item.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element -- tiny local SVGs; next/image adds nothing here
                      <img
                        src={`/icons/skills/${item.icon}.svg`}
                        alt=""
                        width={18}
                        height={18}
                        loading="lazy"
                        className={item.mono ? 'size-[18px] shrink-0 dark:invert' : 'size-[18px] shrink-0'}
                      />
                    ) : (
                      // No logo for this one: a small accent square keeps the rows aligned.
                      <span aria-hidden className="grid size-[18px] shrink-0 place-items-center">
                        <span className="size-1.5 bg-brand" />
                      </span>
                    )}
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
