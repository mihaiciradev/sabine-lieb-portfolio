import { img } from "@/content/img";
import type { Block, Fig } from "@/content/projects";
import { ui, type Lang } from "@/i18n";
import { Pic } from "./pic";
import { PlanToSection } from "./plan-to-section";
import { FloorPlans } from "./floor-plans";
import { SlatReveal } from "./slat-reveal";
import { PavilionModel } from "./pavilion/pavilion-model";
import { Words } from "./words";

const asLightbox = (f: Fig) => {
  const d = img(f.image);
  return { src: d.src, width: d.width, height: d.height, alt: f.alt, caption: f.caption ?? "" };
};

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Which blocks become stops in the page navigator, and under what name. */
function chapter(b: Block, lang: Lang): string | null {
  const c = ui[lang].chapters;
  switch (b.type) {
    case "lead":
      return c.overview;
    case "text":
    case "themes":
    case "floors":
      return b.title;
    case "planSection":
      return c.cut;
    case "model":
      return c.model;
    default:
      return null;
  }
}

export function ProjectBlocks({ blocks, lang }: { blocks: Block[]; lang: Lang }) {
  return (
    <div className="flex flex-col gap-[clamp(4rem,10vw,9rem)] py-[clamp(4rem,10vw,9rem)]">
      {blocks.map((b, i) => {
        const name = chapter(b, lang);
        return (
          <div key={i} id={name ? slug(name) : undefined} data-nav={name ?? undefined} className={name ? "scroll-mt-20 outline-none" : undefined}>
            <BlockView block={b} lang={lang} />
          </div>
        );
      })}
    </div>
  );
}

function BlockView({ block, lang }: { block: Block; lang: Lang }) {
  const t = ui[lang];
  switch (block.type) {
    case "lead":
      return (
        <div className="gutter grid-sheet">
          <p className="col-span-4 font-display text-[clamp(1.5rem,3.2vw,2.75rem)] font-normal leading-[1.15] tracking-tight text-balance md:col-span-9 md:col-start-3">
            <Words text={block.text} />
          </p>
        </div>
      );
    case "text":
      return (
        <section className="gutter grid-sheet reveal gap-y-4">
          <h2 className="label col-span-4 text-oxblood md:col-span-2 md:col-start-3 md:pt-1.5">{block.title}</h2>
          <div className="col-span-4 space-y-4 text-[1.0625rem] leading-relaxed md:col-span-6 lg:col-span-5">
            {block.body.map((p) => (
              <p key={p.slice(0, 24)} className="text-pretty">
                {p}
              </p>
            ))}
          </div>
        </section>
      );
    case "themes":
      return (
        <section className="gutter">
          <h2 className="label mb-6 text-oxblood">{block.title}</h2>
          <ol className="grid grid-cols-1 border-l border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
            {block.items.map((item, i) => (
              <li key={item.title} className="theme-card border-b border-r border-ink p-5 md:p-6" style={{ "--i": i } as React.CSSProperties}>
                <span className="label text-graphite">0{i + 1}</span>
                <h3 className="mt-6 font-display text-2xl font-semibold leading-tight tracking-tight md:mt-10">{item.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/80">{item.body}</p>
              </li>
            ))}
          </ol>
        </section>
      );
    case "figure": {
      const { fig, layout } = block;
      if (layout === "bleed")
        return (
          <div className="settle overflow-hidden">
            <Pic fig={fig} sizes="100vw" className="[&_figcaption]:gutter" />
          </div>
        );
      if (layout === "wide")
        return (
          <div className="gutter reveal">
            <Pic fig={fig} sizes="(min-width: 1600px) 1520px, 95vw" />
          </div>
        );
      return (
        <div className="gutter grid-sheet reveal">
          <Pic fig={fig} sizes="(min-width: 768px) 50vw, 100vw" className="col-span-4 md:col-span-6 md:col-start-4" />
        </div>
      );
    }
    case "pair":
      return (
        <div className="gutter grid-sheet items-end gap-y-12">
          {block.figs.map((f, i) => (
            <Pic
              key={f.image}
              fig={f}
              sizes="(min-width: 768px) 48vw, 100vw"
              className={`reveal col-span-4 md:col-span-6 ${i === 1 ? "md:translate-y-[clamp(0rem,6vw,6rem)]" : ""}`}
            />
          ))}
        </div>
      );
    case "row":
      return (
        <div className="gutter grid-sheet gap-y-10">
          {block.figs.map((f, i) => (
            <Pic key={f.image} fig={f} sizes="(min-width: 768px) 32vw, 100vw" className="reveal col-span-4" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
      );
    case "planSection":
      return (
        <PlanToSection
          plan={asLightbox(block.plan)}
          section={asLightbox(block.section)}
          cut={block.cut}
          label={block.label}
          labels={{ plan: t.plan, section: t.section, scrollToCut: t.scrollToCut(block.label) }}
        />
      );
    case "floors":
      return (
        <section className="gutter">
          <FloorPlans
            title={block.title}
            floorLabel={t.floor}
            initial={Math.min(1, block.floors.length - 1)}
            floors={block.floors.map((f) => ({ label: f.label, image: asLightbox(f.fig) }))}
          />
        </section>
      );
    case "slats":
      return (
        <div>
          <SlatReveal>
            <Pic fig={block.fig} sizes="100vw" caption={false} />
          </SlatReveal>
          {block.fig.caption ? (
            <p className="gutter label mt-3 max-w-[60ch] normal-case tracking-normal text-graphite [font-size:0.8125rem]">{block.fig.caption}</p>
          ) : null}
        </div>
      );
    case "model":
      return (
        <section className="gutter grid-sheet items-center gap-y-8">
          <div className="col-span-4 md:col-span-6 md:col-start-2">
            <ModelFigure lang={lang} />
          </div>
          <div className="col-span-4 md:col-span-4 md:col-start-8">
            <p className="font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-snug tracking-tight">
              {t.modelText[0]}
              <span className="text-oxblood">{t.modelText[1]}</span>
              {t.modelText[2]}
            </p>
          </div>
        </section>
      );
  }
}

export function ModelFigure({ lang }: { lang: Lang }) {
  const d = img("pavilion-ana-lupas/exploded");
  return (
    <PavilionModel
      labels={ui[lang].model}
      fallback={{
        src: d.src,
        width: d.width,
        height: d.height,
        alt:
          lang === "ro"
            ? "Axonometrie explodată a pavilionului: grila acoperișului, tavanul în patru ape, fermele, mansarda și panourile pereților exteriori."
            : "Exploded axonometric of the pavilion: roof grid, hipped ceiling, trusses, attic room and outer wall panels.",
      }}
    />
  );
}
