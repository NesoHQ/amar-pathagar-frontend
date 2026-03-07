'use client';

import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/components/theme/theme.provider';
import { FOOTER_QUICK_LINKS_AUTH, FOOTER_QUICK_LINKS_GUEST } from '@/constants/footer';
import { getFooterBackground } from '@/utils/footer';
import { FooterAbout } from './footer.about';
import { FooterLinks } from './footer.links';
import { FooterContribute } from './footer.contribute';
import { FooterCopyright } from './footer.copyright';

export function Footer() {
  const { isAuthenticated } = useAuthStore();
  const { theme } = useTheme();

  const quickLinks = isAuthenticated ? FOOTER_QUICK_LINKS_AUTH : FOOTER_QUICK_LINKS_GUEST;

  return (
    <footer 
      className=""
      style={{
        backgroundColor: getFooterBackground(theme),
        color: 'var(--card-foreground)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12 md:py-12">
          <FooterAbout />
          <FooterLinks links={quickLinks} />
          <FooterContribute />
        </div>
        <FooterCopyright />
      </div>
    </footer>
  );
}
