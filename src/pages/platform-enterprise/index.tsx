import { useEffect } from 'react';

export default function RedirectPlatformEnterprise() {
  useEffect(() => {
    window.location.href = 'https://docs.seqera.io/platform-enterprise';
  }, []);

  return null;
}