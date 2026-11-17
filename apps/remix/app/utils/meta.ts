import { BRAND_NAME, NEXT_PUBLIC_WEBAPP_URL } from '@documenso/lib/constants/app';
import { i18n, type MessageDescriptor } from '@lingui/core';

// paperrocket-sign: brand pass. Title, description and og tags come from NEXT_PUBLIC_BRAND_NAME, no product name.
export const appMetaTags = (title?: MessageDescriptor) => {
  const brand = BRAND_NAME();
  const description = `Document signing for ${brand}.`;

  return [
    {
      title: title ? `${i18n._(title)} - ${brand}` : brand,
    },
    {
      name: 'description',
      content: description,
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
    {
      property: 'og:title',
      content: brand,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:image',
      content: `${NEXT_PUBLIC_WEBAPP_URL()}/opengraph-image.jpg`,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      name: 'twitter:image',
      content: `${NEXT_PUBLIC_WEBAPP_URL()}/opengraph-image.jpg`,
    },
  ];
};
