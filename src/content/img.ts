import manifest from "./images.json";

export type ImageKey = keyof typeof manifest;

export type Img = {
  src: string;
  width: number;
  height: number;
  blur: string;
};

export function img(key: ImageKey): Img {
  return manifest[key];
}
