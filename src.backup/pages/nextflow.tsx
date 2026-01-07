import React from 'react';

export default function RedirectPage() {
  React.useEffect(() => {
    window.location.href = "https://www.nextflow.io/docs/latest";
  }, []);
  return null;
}
