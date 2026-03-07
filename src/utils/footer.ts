export const getFooterBackground = (theme: string): string => {
  switch (theme) {
    case 'dark':
      return 'var(--card)';
    case 'reading':
      return '#EBE7DD';
    default:
      return '#F5F5F5';
  }
};

export const handleFooterLinkClick = (href: string, router: any) => {
  if (href.startsWith('/#')) {
    const id = href.substring(2);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    router.push(href);
  }
};
