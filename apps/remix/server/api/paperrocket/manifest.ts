import { BRAND_NAME } from '@documenso/lib/constants/app';
import { env } from '@documenso/lib/utils/env';
import { Hono } from 'hono';

import type { HonoEnv } from '../../router';

/**
 * The web app manifest, named after NEXT_PUBLIC_BRAND_NAME instead of the static file that said Documenso. Icons are
 * NEXT_PUBLIC_APPLE_TOUCH_ICON_URL when set (declared 180x180), otherwise the neutral glyph in /public.
 */
export const paperRocketManifestRoute = new Hono<HonoEnv>().get('/', (c) => {
  const basePath = (env('NEXT_PUBLIC_BASE_PATH') ?? '').replace(/\/$/, '');
  const iconUrl = env('NEXT_PUBLIC_APPLE_TOUCH_ICON_URL');

  const icons = iconUrl
    ? [{ src: iconUrl, sizes: '180x180', type: 'image/png' }]
    : [
        { src: `${basePath}/android-chrome-192x192.png`, sizes: '192x192', type: 'image/png' },
        { src: `${basePath}/android-chrome-512x512.png`, sizes: '512x512', type: 'image/png' },
      ];

  const manifest = {
    name: BRAND_NAME(),
    short_name: BRAND_NAME(),
    icons,
    theme_color: env('NEXT_PUBLIC_PRIMARY_COLOR') || '#FFFFFF',
    background_color: '#FFFFFF',
    display: 'standalone',
  };

  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
});
