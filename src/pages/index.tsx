import React from 'react';

export default function RedirectPage() {
  React.useEffect(() => {
    window.location.href = "https://docs.seqera.io";
  }, []);
  return null;
}
