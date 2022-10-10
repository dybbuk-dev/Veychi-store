export interface ILayoutImage {
  id: number;
  title: string;
  text: string;
  text_positionm: 'left' | 'right' | 'middle';
  subtitle: string;
  subtitle_position: string;
  slug: string;
  type: 'small' | 'medium' | 'large';
}

export interface IImage {
  mobile: {
    url: string;
    width: number;
    height: number;
  };
  desktop: {
    url: string;
    width: number;
    height: number;
  };
}
export interface FormImage {
  desktopImageUrl: string;
  mobileImageUrl: string;
}
export interface FormValue extends ILayoutImage {
  image: IImage;
}

export type FormValues = {
  A: FormValue;
  B: FormValue;
};
