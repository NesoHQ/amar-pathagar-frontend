export interface FooterLink {
  label: string;
  href: string;
  onClick?: () => void;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}
