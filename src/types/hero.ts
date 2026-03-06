export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: {
    primary: {
      text: string;
      href: string;
    };
    secondary?: {
      text: string;
      href: string;
    };
  };
  stats: HeroStat[];
  trustIndicators: TrustIndicator[];
}

export interface HeroCarouselProps {
  slides: HeroSlide[];
  autoplay?: boolean;
  autoplayDelay?: number;
}

export interface HeroStat {
  icon: string;
  value: string;
  label: string;
}

export interface TrustIndicator {
  icon: string;
  text: string;
}
