'use client';

import { useRouter } from 'next/navigation';
import { Heart, Github as GithubIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GITHUB_URL } from '@/constants/footer';

export function FooterContribute() {
  const router = useRouter();

  return (
    <div>
      <h5 
        className="font-bold uppercase tracking-wider mb-4 text-sm"
        style={{ color: 'var(--foreground)' }}
      >
        Contribute
      </h5>
      <p 
        className="text-sm mb-4 leading-relaxed"
        style={{ color: 'var(--muted-foreground)' }}
      >
        This is an open-source project. Help us improve!
      </p>
      <div className="flex flex-col gap-3">
        <Button
          variant="outline"
          size="sm"
          className="uppercase justify-center"
          onClick={() => window.open(GITHUB_URL, '_blank')}
        >
          <GithubIcon className="w-4 h-4" />
          <span>View on GitHub</span>
        </Button>
        <Button
          variant="default"
          size="sm"
          className="uppercase justify-center"
          onClick={() => router.push('/donations')}
        >
          <Heart className="w-4 h-4" />
          <span>Donate Books</span>
        </Button>
      </div>
    </div>
  );
}
