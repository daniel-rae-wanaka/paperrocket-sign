import { getOptionalSession } from '@documenso/auth/server/lib/utils/get-session';
import { useChildRouteFlags } from '@documenso/lib/client-only/hooks/use-child-route-flags';
import { OrganisationProvider } from '@documenso/lib/client-only/providers/organisation';
import { useSession } from '@documenso/lib/client-only/providers/session';
import { getTeamSettings } from '@documenso/lib/server-only/team/get-team-settings';
import { getSiteSettings } from '@documenso/lib/server-only/site-settings/get-site-settings';
import { SITE_SETTINGS_BANNER_ID } from '@documenso/lib/server-only/site-settings/schemas/banner';
import { ZCssVarsSchema } from '@documenso/lib/types/css-vars';
import { getPrimaryColourCss } from '@documenso/lib/utils/primary-colour';
import { buildTeamWhereQuery } from '@documenso/lib/utils/teams';
import { prisma } from '@documenso/prisma';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';
import { msg } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { Link, Outlet } from 'react-router';

import { useCspNonce } from '~/utils/nonce';
import { AppBanner } from '~/components/general/app-banner';
import { Header } from '~/components/general/app-header';
import { GenericErrorLayout } from '~/components/general/generic-error-layout';
import { OrganisationBillingBanner } from '~/components/general/organisations/organisation-billing-banner';
import { OrganisationQuotaBanner } from '~/components/general/organisations/organisation-quota-banner';
import { VerifyEmailBanner } from '~/components/general/verify-email-banner';
import { authenticatedMiddleware } from '~/middleware/authenticated';
import { TeamProvider } from '~/providers/team';

import type { Route } from './+types/_layout';

/**
 * Don't revalidate (run the loader on sequential navigations)
 *
 * Update values via providers.
 */
export const shouldRevalidate = ({
  currentParams,
  nextParams,
}: {
  currentParams: Record<string, string | undefined>;
  nextParams: Record<string, string | undefined>;
}) => currentParams.orgUrl !== nextParams.orgUrl || currentParams.teamUrl !== nextParams.teamUrl;

export const middleware = [authenticatedMiddleware];

/**
 * paperrocket-sign: the CSS that sets the primary colour from the current organisation's (or team's) branding colour,
 * when branding is on and a primary colour is set. Null otherwise, so the env colour or stock colour stays.
 */
const loadBrandPrimaryCss = async ({
  request,
  params,
}: {
  request: Request;
  params: Record<string, string | undefined>;
}) => {
  try {
    const { user } = await getOptionalSession(request);

    if (!user) {
      return null;
    }

    let settings: { brandingEnabled: boolean; brandingColors: unknown } | null = null;

    if (params.teamUrl) {
      const team = await prisma.team.findFirst({
        where: { url: params.teamUrl, ...buildTeamWhereQuery({ teamId: undefined, userId: user.id }) },
        select: { id: true },
      });

      settings = team ? await getTeamSettings({ teamId: team.id }) : null;
    } else if (params.orgUrl) {
      const organisation = await prisma.organisation.findFirst({
        where: { url: params.orgUrl, members: { some: { userId: user.id } } },
        select: { organisationGlobalSettings: { select: { brandingEnabled: true, brandingColors: true } } },
      });

      settings = organisation?.organisationGlobalSettings ?? null;
    }

    if (!settings?.brandingEnabled || !settings.brandingColors) {
      return null;
    }

    const colours = ZCssVarsSchema.safeParse(settings.brandingColors);

    return colours.success ? getPrimaryColourCss(colours.data.primary) : null;
  } catch {
    return null;
  }
};

export async function loader({ request, params }: Route.LoaderArgs) {
  const banner = await getSiteSettings().then((settings) =>
    settings.find((setting) => setting.id === SITE_SETTINGS_BANNER_ID),
  );

  const brandPrimaryCss = await loadBrandPrimaryCss({ request, params });

  return {
    banner,
    brandPrimaryCss,
  };
}

export default function Layout({ loaderData, params, matches }: Route.ComponentProps) {
  const { banner, brandPrimaryCss } = loaderData;
  const cspNonce = useCspNonce();

  const { user, organisations } = useSession();

  const { layoutMode } = useChildRouteFlags();

  const teamUrl = params.teamUrl;
  const orgUrl = params.orgUrl;

  const teams = organisations.flatMap((org) => org.teams);

  const extractCurrentOrganisation = () => {
    if (orgUrl) {
      return organisations.find((org) => org.url === orgUrl);
    }

    // Search organisations to find the team since we don't have access to the orgUrl in the URL.
    if (teamUrl) {
      return organisations.find((org) => org.teams.some((team) => team.url === teamUrl));
    }

    return null;
  };

  const currentTeam = teams.find((team) => team.url === teamUrl);
  const currentOrganisation = extractCurrentOrganisation() || null;

  const orgNotFound = params.orgUrl && !currentOrganisation;
  const teamNotFound = params.teamUrl && !currentTeam;

  // Hide the header for editor routes.
  const hideHeader = matches.some(
    (match) =>
      match?.id === 'routes/_authenticated+/t.$teamUrl+/documents.$id.edit' ||
      match?.id === 'routes/_authenticated+/t.$teamUrl+/templates.$id.edit',
  );

  if (orgNotFound || teamNotFound) {
    return (
      <GenericErrorLayout
        errorCode={404}
        errorCodeMap={{
          404: orgNotFound
            ? {
                heading: msg`Organisation not found`,
                subHeading: msg`404 Organisation not found`,
                message: msg`The organisation you are looking for may have been removed, renamed or may have never existed.`,
              }
            : {
                heading: msg`Team not found`,
                subHeading: msg`404 Team not found`,
                message: msg`The team you are looking for may have been removed, renamed or may have never existed.`,
              },
        }}
        primaryButton={
          <Button asChild>
            <Link to="/">
              <Trans>Go home</Trans>
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <OrganisationProvider organisation={currentOrganisation}>
      <TeamProvider team={currentTeam || null}>
        {brandPrimaryCss && <style nonce={cspNonce}>{brandPrimaryCss}</style>}

        <div className={cn({ 'md:flex md:h-dvh md:flex-col md:overflow-hidden': layoutMode === 'settings' })}>
          <OrganisationBillingBanner />

          <OrganisationQuotaBanner />

          {!user.emailVerified && <VerifyEmailBanner email={user.email} />}

          {banner && !hideHeader && <AppBanner banner={banner} />}

          {!hideHeader && <Header fullWidth={layoutMode === 'settings'} />}

          <main
            className={cn({
              'mt-8 pb-8 md:mt-12 md:pb-12': !hideHeader && layoutMode !== 'settings',
              'md:flex md:min-h-0 md:flex-1 md:flex-col': layoutMode === 'settings',
            })}
          >
            <Outlet />
          </main>
        </div>
      </TeamProvider>
    </OrganisationProvider>
  );
}
