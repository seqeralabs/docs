import React from 'react';

export function DefinitionTerm({ children }) {
  return <dt>{children}</dt>;
}

export function DefinitionDescription({ children }) {
  return <dd>{children}</dd>;
}

export default function DefinitionList({ children }) {
  return <dl>{children}</dl>;
}
