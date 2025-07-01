import React from 'react';

export default function RedirectPage() {
  React.useEffect(() => {
    window.location.href = "nextflow/nextflow";
  }, []);
  return null;
}
