import { BRAND_NAME, NEXT_PUBLIC_WEBAPP_URL } from '../constants/app';
import { PASSKEY_TIMEOUT } from '../constants/auth';

/**
 * Extracts common fields to identify the RP (relying party)
 */
export const getAuthenticatorOptions = () => {
  const webAppBaseUrl = new URL(NEXT_PUBLIC_WEBAPP_URL());
  const rpId = webAppBaseUrl.hostname;

  return {
    rpName: BRAND_NAME(), // paperrocket-sign: brand pass
    rpId,
    origin: NEXT_PUBLIC_WEBAPP_URL(),
    timeout: PASSKEY_TIMEOUT,
  };
};
