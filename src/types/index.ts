export enum CommonSound {
  BackgroundMusic = 'bgMusic',
}

export interface Media {
  url: string;
  height?: number;
  width?: number;
  name?: string;
  alternativeText?: string;
  mime?: string;
}
