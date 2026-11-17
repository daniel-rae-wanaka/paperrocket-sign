import { BRAND_NAME } from '@documenso/lib/constants/app';
import { useOptionalCurrentOrganisation } from '@documenso/lib/client-only/providers/organisation';
import { cn } from '@documenso/ui/lib/utils';
import { useEffect, useState } from 'react';

// paperrocket-sign: brand pass. Replaces the Documenso mark in logged-in headers: the organisation's own logo when it
// has one, otherwise the instance's brand name as text. The logo route answers 404 or 400 when there is none.
export const AppBrandMark = ({ className }: { className?: string }) => {
  const organisation = useOptionalCurrentOrganisation();
  const [logoFailed, setLogoFailed] = useState(false);

  const organisationId = organisation?.id;

  useEffect(() => {
    setLogoFailed(false);
  }, [organisationId]);

  if (organisationId && !logoFailed) {
    return (
      <img
        src={`/api/branding/logo/organisation/${organisationId}`}
        alt={organisation?.name ?? BRAND_NAME()}
        className={cn('h-6 w-auto', className)}
        onError={() => setLogoFailed(true)}
      />
    );
  }

  return <span className={cn('font-semibold text-foreground text-lg tracking-tight', className)}>{BRAND_NAME()}</span>;
};
