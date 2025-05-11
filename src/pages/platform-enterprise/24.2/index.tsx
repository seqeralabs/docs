import React from 'react';

export default function RedirectPage() {
  React.useEffect(() => {
    window.location.href = "https://deploy-preview-604--seqera-docs.netlify.app/platform-enterprise/24.2";
  }, []);
  return null;
}