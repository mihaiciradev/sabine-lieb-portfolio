import Image from "next/image";
import { img } from "@/content/img";
import type { Fig } from "@/content/projects";
import { Zoomable } from "./lightbox";

type Props = {
  fig: Fig;
  sizes: string;
  /** "cover" fills a sized parent; "natural" keeps the source's own framing. */
  fit?: "cover" | "natural";
  preload?: boolean;
  className?: string;
  imgClassName?: string;
  caption?: boolean;
  style?: React.CSSProperties;
};

export function Pic({ fig, sizes, fit = "natural", preload, className = "", imgClassName = "", caption = true, style }: Props) {
  const data = img(fig.image);
  const quality = fig.drawing ? 90 : 72;

  const image =
    fit === "cover" ? (
      <Image
        src={data.src}
        alt={fig.alt}
        fill
        sizes={sizes}
        quality={quality}
        preload={preload}
        placeholder={fig.drawing ? "empty" : "blur"}
        blurDataURL={data.blur}
        className={`object-cover ${imgClassName}`}
      />
    ) : (
      <Image
        src={data.src}
        alt={fig.alt}
        width={data.width}
        height={data.height}
        sizes={sizes}
        quality={quality}
        preload={preload}
        placeholder={fig.drawing ? "empty" : "blur"}
        blurDataURL={data.blur}
        className={`h-auto w-full ${imgClassName}`}
      />
    );

  return (
    <figure className={`${fig.drawing ? "drawing" : ""} ${className}`} style={style}>
      {fig.drawing ? (
        <Zoomable
          image={{ src: data.src, width: data.width, height: data.height, alt: fig.alt, caption: fig.caption }}
          className={fit === "cover" ? "absolute inset-0" : ""}>
          {image}
        </Zoomable>
      ) : (
        image
      )}
      {caption && fig.caption ? (
        <figcaption className="label mt-3 max-w-[60ch] normal-case tracking-normal text-graphite [font-size:0.8125rem]">
          {fig.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
